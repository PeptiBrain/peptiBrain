import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidGaId } from "@/lib/app-settings";

// Lee/guarda los ajustes de integraciones del panel (solo el dueño). El único
// ajuste hoy es el ID de Google Analytics; la tabla es genérica para sumar más.
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const { data } = await supabase.from("app_settings").select("key, value");
  const settings: Record<string, string> = {};
  for (const row of data || []) settings[row.key] = row.value || "";
  return NextResponse.json({ settings });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { gaId } = (await request.json().catch(() => ({}))) as { gaId?: string };
  const value = (gaId || "").trim();

  // Cadena vacía = desconectar Google Analytics. Si viene algo, validamos el formato.
  if (value && !isValidGaId(value)) {
    return NextResponse.json({ error: "invalid_ga_id" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("app_settings")
    .upsert({ key: "ga_measurement_id", value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // El layout recoge el nuevo ID en ≤5 min (caché de getPublicSetting).
  return NextResponse.json({ ok: true, gaId: value });
}
