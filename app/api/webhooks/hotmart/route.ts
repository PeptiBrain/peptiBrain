import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const OFFER_TO_PLAN: Record<string, "premium" | "family"> = {
  m7yz3mfb: "premium",
  wca2xckm: "premium",
  iucld0wb: "family",
  lgn3ozqy: "family",
};

// Oferta de fundadores: pago único "de por vida" — código de oferta configurable
// por env var (se crea en Hotmart como producto/oferta de pago ÚNICO, no suscripción).
// Misma variable que usa el checkout del lado del cliente (lib/hotmart-links.ts) — el
// servidor también puede leer variables NEXT_PUBLIC_, no hace falta duplicarla.
const LIFETIME_OFFER_CODE = process.env.NEXT_PUBLIC_HOTMART_OFFER_LIFETIME;

const APPROVED_EVENTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const PENDING_EVENTS = new Set(["PURCHASE_DELAYED", "PURCHASE_BILLET_PRINTED", "PURCHASE_PIX_GENERATED"]);
const REVOKE_EVENT_STATUS: Record<string, string> = {
  PURCHASE_CANCELED: "canceled",
  SUBSCRIPTION_CANCELLATION: "canceled",
  PURCHASE_EXPIRED: "canceled",
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
};

function hottokMatches(received: string | null): boolean {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Hotmart v2.0.0 manda el hottok en el header, no en el cuerpo del mensaje.
  const receivedHottok = request.headers.get("x-hotmart-hottok");
  if (!hottokMatches(receivedHottok)) {
    return NextResponse.json({ error: "invalid hottok" }, { status: 401 });
  }

  const event = body.event as string | undefined;
  const eventId = body.id as string | undefined;
  const buyerEmailRaw = body.data?.buyer?.email as string | undefined;
  const offerCode = body.data?.purchase?.offer?.code as string | undefined;

  if (!event || !buyerEmailRaw) {
    return NextResponse.json({ error: "missing event or buyer email" }, { status: 400 });
  }
  const buyerEmail = buyerEmailRaw.toLowerCase().trim();

  const supabase = createAdminClient();

  // Idempotencia: si ya procesamos este event_id, no lo repetimos.
  if (eventId) {
    const { data: existing } = await supabase
      .from("hotmart_events")
      .select("event_id")
      .eq("event_id", eventId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
  }

  const isLifetimePurchase = Boolean(LIFETIME_OFFER_CODE && offerCode === LIFETIME_OFFER_CODE);
  let updates: { plan: string; plan_status: string; is_lifetime: boolean } | null = null;

  if (APPROVED_EVENTS.has(event)) {
    const plan = (offerCode && OFFER_TO_PLAN[offerCode]) || "premium";
    updates = { plan, plan_status: "active", is_lifetime: isLifetimePurchase };
  } else if (PENDING_EVENTS.has(event)) {
    updates = {
      plan: (offerCode && OFFER_TO_PLAN[offerCode]) || "premium",
      plan_status: "past_due",
      is_lifetime: false,
    };
  } else if (event in REVOKE_EVENT_STATUS) {
    // Un reembolso/contracargo SÍ debe quitar el acceso de por vida también.
    updates = { plan: "free", plan_status: REVOKE_EVENT_STATUS[event], is_lifetime: false };
  }

  if (updates) {
    const { data: updatedRows, error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .ilike("email", buyerEmail)
      .select("id");
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    // Si nadie con ese correo tiene perfil todavía (compró antes de registrarse),
    // guardamos el pago para aplicarlo solo cuando esa persona cree su cuenta.
    if (!updatedRows || updatedRows.length === 0) {
      if (updates.plan !== "free") {
        await supabase.from("pending_purchases").insert({
          email: buyerEmail,
          plan: updates.plan,
          plan_status: updates.plan_status,
          is_lifetime: updates.is_lifetime,
        });
      }
    } else if (updates.plan !== "family") {
      // Si quien pagaba Family deja de pagar (o pasa a otro plan), a quienes
      // heredaron el asiento Premium por su cuenta también se les baja a free.
      const ownerId = updatedRows[0].id;
      await supabase.from("profiles").update({ plan: "free", family_seat_owner_id: null }).eq("family_seat_owner_id", ownerId);
    }
  }

  if (eventId) {
    await supabase.from("hotmart_events").insert({
      event_id: eventId,
      event_type: event,
      payload: body,
    });
  }

  return NextResponse.json({ ok: true });
}
