import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { loadAdminOverview } from "@/lib/admin-data";
import { AdminDashboard } from "@/components/app/admin/AdminDashboard";

// Nunca cachear: el acceso depende de quién esté logueado en cada petición.
export const dynamic = "force-dynamic";

function hoursSince(iso: string | null) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/app");

  const data = await loadAdminOverview();

  const alerts: string[] = [];
  if (hoursSince(data.lastWebhookEventAt) > 168) {
    alerts.push(
      "El webhook de Hotmart no ha recibido eventos en más de 7 días. Si alguien compra y el webhook falla, no le llega el acceso."
    );
  }
  if (data.assistantPaused) {
    alerts.push(
      `El Asistente IA está PAUSADO hoy — se llegó al tope diario (${data.assistantMessagesToday}/${data.assistantGlobalLimit}). Vuelve mañana o sube ASSISTANT_GLOBAL_DAILY_LIMIT.`
    );
  } else if (data.assistantMessagesToday >= data.assistantGlobalLimit * 0.8) {
    alerts.push(
      `El Asistente IA va en ${data.assistantMessagesToday} de ${data.assistantGlobalLimit} mensajes de hoy — cerca del tope.`
    );
  }
  if (data.pastDue > 0) {
    alerts.push(
      `${data.pastDue} usuario(s) con el pago fallido — clientes que sí querían pagar, revisa el reintento en Hotmart.`
    );
  }

  return <AdminDashboard data={data} alerts={alerts} />;
}
