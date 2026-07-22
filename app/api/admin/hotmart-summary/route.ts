import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { getHotmartSummary } from "@/lib/hotmart-api";

// Devuelve las ventas REALES de Hotmart para el panel (solo el dueño). Se cachea
// 10 min: es una llamada a una API externa, no tiene sentido pedirla en cada carga.
export const revalidate = 600;

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const summary = await getHotmartSummary();
  return NextResponse.json(summary);
}
