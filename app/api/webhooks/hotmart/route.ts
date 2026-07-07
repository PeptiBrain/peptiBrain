import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const OFFER_TO_PLAN: Record<string, "premium" | "family"> = {
  m7yz3mfb: "premium",
  wca2xckm: "premium",
  iucld0wb: "family",
  lgn3ozqy: "family",
};

const APPROVED_EVENTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const REVOKE_EVENTS = new Set([
  "PURCHASE_CANCELED",
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_EXPIRED",
  "SUBSCRIPTION_CANCELLATION",
]);

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Hotmart v2.0.0 manda el hottok en el header, no en el cuerpo del mensaje.
  const receivedHottok = request.headers.get("x-hotmart-hottok");
  if (!process.env.HOTMART_HOTTOK || receivedHottok !== process.env.HOTMART_HOTTOK) {
    return NextResponse.json({ error: "invalid hottok" }, { status: 401 });
  }

  const event = body.event as string | undefined;
  const eventId = body.id as string | undefined;
  const buyerEmail = body.data?.buyer?.email as string | undefined;
  const offerCode = body.data?.purchase?.offer?.code as string | undefined;

  if (!event || !buyerEmail) {
    return NextResponse.json({ error: "missing event or buyer email" }, { status: 400 });
  }

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

  let updates: { plan: string; plan_status: string } | null = null;

  if (APPROVED_EVENTS.has(event)) {
    const plan = (offerCode && OFFER_TO_PLAN[offerCode]) || "premium";
    updates = { plan, plan_status: "active" };
  } else if (REVOKE_EVENTS.has(event)) {
    updates = { plan: "free", plan_status: "canceled" };
  }

  if (updates) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("email", buyerEmail);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
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
