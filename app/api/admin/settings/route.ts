import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidGaId, isValidClarityId } from "@/lib/app-settings";

// Lee/guarda los ajustes de integraciones del panel (solo el dueño). Hoy: ID de
// Google Analytics y Project ID de Microsoft Clarity; la tabla es genérica para sumar más.
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

  const body = (await request.json().catch(() => ({}))) as { gaId?: string; clarityId?: string };

  // El panel manda UN ajuste por vez (gaId o clarityId). Cadena vacía = desconectar.
  let key: string;
  let value: string;
  if ("clarityId" in body) {
    key = "clarity_project_id";
    value = (body.clarityId || "").trim();
    if (value && !isValidClarityId(value)) {
      return NextResponse.json({ error: "invalid_clarity_id" }, { status: 400 });
    }
  } else {
    key = "ga_measurement_id";
    value = (body.gaId || "").trim();
    if (value && !isValidGaId(value)) {
      return NextResponse.json({ error: "invalid_ga_id" }, { status: 400 });
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("app_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // El layout recoge el nuevo valor en ≤5 min (caché de getPublicSetting).
  return NextResponse.json({ ok: true, value });
}
