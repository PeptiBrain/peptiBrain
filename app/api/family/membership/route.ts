import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// El plan Family regala Premium a hasta 2 invitados base (3 cuentas en total con
// el dueño), tal como ya lo promete el Centro de Ayuda. Cada asiento extra
// comprado (5€/mes, family_extra_seats) suma uno más al tope. Los cambios de
// plan/asiento solo pasan por aquí (service_role) — nunca directo desde el cliente.
const BASE_FAMILY_GUESTS = 2;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const action = body?.action as string | undefined;
  const memberId = body?.memberId as string | undefined;
  if (!action || !memberId) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: row } = await admin.from("family_members").select("*").eq("id", memberId).single();
  if (!row) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const { data: myProfile } = await admin.from("profiles").select("email, family_seat_owner_id").eq("id", user.id).single();
  const isInvitee = Boolean(myProfile?.email && row.email.toLowerCase() === myProfile.email.toLowerCase());

  if (action === "decline") {
    if (!isInvitee) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    await admin.from("family_members").update({ invite_status: "revoked" }).eq("id", memberId);
    return NextResponse.json({ ok: true });
  }

  if (action === "accept") {
    if (!isInvitee) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const { data: owner } = await admin.from("profiles").select("plan").eq("id", row.owner_id).single();
    if (owner?.plan === "family") {
      const { count } = await admin
        .from("family_members")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", row.owner_id)
        .eq("invite_status", "accepted");
      const { count: extraSeats } = await admin
        .from("family_extra_seats")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", row.owner_id)
        .eq("status", "active");
      const maxGuests = BASE_FAMILY_GUESTS + (extraSeats || 0);
      if ((count || 0) >= maxGuests) {
        return NextResponse.json({ error: "seat_limit_reached" }, { status: 409 });
      }
      await admin
        .from("profiles")
        .update({ plan: "family", family_seat_owner_id: row.owner_id })
        .eq("id", user.id);
    }
    await admin.from("family_members").update({ invite_status: "accepted" }).eq("id", memberId);
    return NextResponse.json({ ok: true });
  }

  if (action === "leave") {
    if (!isInvitee) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    if (myProfile?.family_seat_owner_id === row.owner_id) {
      await admin.from("profiles").update({ plan: "free", family_seat_owner_id: null }).eq("id", user.id);
    }
    await admin.from("family_members").delete().eq("id", memberId);
    return NextResponse.json({ ok: true });
  }

  if (action === "remove") {
    if (row.owner_id !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const { data: guestProfile } = await admin
      .from("profiles")
      .select("id, family_seat_owner_id")
      .ilike("email", row.email)
      .maybeSingle();
    if (guestProfile && guestProfile.family_seat_owner_id === user.id) {
      await admin.from("profiles").update({ plan: "free", family_seat_owner_id: null }).eq("id", guestProfile.id);
    }
    await admin.from("family_members").delete().eq("id", memberId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}
