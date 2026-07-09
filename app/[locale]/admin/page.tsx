import { redirect } from "next/navigation";
import { ShoppingCart, Users, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { loadAdminOverview } from "@/lib/admin-data";
import { UsersTable } from "@/components/app/admin/UsersTable";

function hoursSince(iso: string | null) {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/app");

  const data = await loadAdminOverview();

  const webhookStale = hoursSince(data.lastWebhookEventAt) > 168; // 7 días sin ningún evento
  const aiExpensive = data.assistantMessagesToday >= data.assistantGlobalLimit * 0.8;

  const alerts: { icon: React.ReactNode; text: string }[] = [];
  if (webhookStale) {
    alerts.push({
      icon: <AlertTriangle className="size-4 text-destructive" aria-hidden />,
      text: "El webhook de Hotmart no ha recibido eventos en más de 7 días. Revisa que la conexión siga activa — si alguien compra y el webhook falla, no le llega el acceso.",
    });
  }
  if (data.assistantPaused) {
    alerts.push({
      icon: <AlertTriangle className="size-4 text-destructive" aria-hidden />,
      text: `El Asistente IA está PAUSADO hoy — se llegó al tope diario (${data.assistantMessagesToday}/${data.assistantGlobalLimit} mensajes). Volverá a estar disponible mañana, o puedes subir el tope en ASSISTANT_GLOBAL_DAILY_LIMIT.`,
    });
  } else if (aiExpensive) {
    alerts.push({
      icon: <AlertTriangle className="size-4 text-[var(--notice-icon)]" aria-hidden />,
      text: `El Asistente IA va en ${data.assistantMessagesToday} de ${data.assistantGlobalLimit} mensajes de hoy — se acerca al tope diario.`,
    });
  }
  if (data.pastDue > 0) {
    alerts.push({
      icon: <AlertTriangle className="size-4 text-[var(--notice-icon)]" aria-hidden />,
      text: `${data.pastDue} usuario(s) con el pago fallido (past_due) — son clientes que sí querían pagar, revisa el reintento en Hotmart.`,
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Panel del dueño</h1>
      <p className="text-sm text-muted-foreground">Solo tú puedes ver esta página.</p>

      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        {alerts.length === 0 ? (
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" aria-hidden /> Todo en orden hoy.
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                {a.icon} <span>{a.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3">
          <Users className="mb-2 size-4 text-primary" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">{data.totalUsers}</p>
          <p className="text-xs text-muted-foreground">Usuarios totales</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <ShoppingCart className="mb-2 size-4 text-primary" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">
            {data.usersByPlan.premium + data.usersByPlan.family}
          </p>
          <p className="text-xs text-muted-foreground">Clientes pagando</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Users className="mb-2 size-4 text-primary" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">{data.newSignups7d}</p>
          <p className="text-xs text-muted-foreground">Altas últimos 7 días</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Users className="mb-2 size-4 text-foreground" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">{data.newSignups30d}</p>
          <p className="text-xs text-muted-foreground">Altas últimos 30 días</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="tabular font-display text-xl font-bold text-foreground">{data.voluntaryChurn30d}</p>
          <p className="text-xs text-muted-foreground">Cancelaciones voluntarias (30d)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="tabular font-display text-xl font-bold text-foreground">{data.pastDue}</p>
          <p className="text-xs text-muted-foreground">Pago fallido ahora mismo</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="tabular font-display text-xl font-bold text-foreground">
            {data.refundedOrChargeback30d}
          </p>
          <p className="text-xs text-muted-foreground">Reembolsos/contracargos (30d)</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-card p-4">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Sparkles className="size-4 text-primary" aria-hidden /> Asistente IA — uso de hoy
        </p>
        <p className="text-sm text-foreground">
          {data.assistantMessagesToday} de {data.assistantGlobalLimit} mensajes
          {data.assistantPaused ? " — PAUSADO" : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          Plan: cambia el tope en la variable de entorno <code>ASSISTANT_GLOBAL_DAILY_LIMIT</code>.
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-card p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">Webhook de Hotmart</p>
        <p className="text-sm text-foreground">
          {data.lastWebhookEventAt
            ? `Último evento: ${new Date(data.lastWebhookEventAt).toLocaleString("es")}`
            : "Sin eventos recibidos todavía."}
        </p>
        <p className="text-xs text-muted-foreground">{data.webhookEventsToday} eventos hoy.</p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-foreground">Usuarios</p>
        <UsersTable initialUsers={data.users} />
      </div>
    </div>
  );
}
