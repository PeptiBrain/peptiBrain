import { redirect } from "next/navigation";
import {
  Users,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  TrendingUp,
  Repeat,
  Crown,
  Percent,
  UserPlus,
  Megaphone,
} from "lucide-react";
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
  const s = data.currencySymbol;

  const webhookStale = hoursSince(data.lastWebhookEventAt) > 168;
  const aiExpensive = data.assistantMessagesToday >= data.assistantGlobalLimit * 0.8;

  const alerts: { icon: React.ReactNode; text: string }[] = [];
  if (webhookStale) {
    alerts.push({
      icon: <AlertTriangle className="size-4 text-destructive" aria-hidden />,
      text: "El webhook de Hotmart no ha recibido eventos en más de 7 días. Si alguien compra y el webhook falla, no le llega el acceso.",
    });
  }
  if (data.assistantPaused) {
    alerts.push({
      icon: <AlertTriangle className="size-4 text-destructive" aria-hidden />,
      text: `El Asistente IA está PAUSADO hoy — se llegó al tope diario (${data.assistantMessagesToday}/${data.assistantGlobalLimit}). Vuelve mañana o sube ASSISTANT_GLOBAL_DAILY_LIMIT.`,
    });
  } else if (aiExpensive) {
    alerts.push({
      icon: <AlertTriangle className="size-4 text-[var(--notice-icon)]" aria-hidden />,
      text: `El Asistente IA va en ${data.assistantMessagesToday} de ${data.assistantGlobalLimit} mensajes de hoy — cerca del tope.`,
    });
  }
  if (data.pastDue > 0) {
    alerts.push({
      icon: <AlertTriangle className="size-4 text-[var(--notice-icon)]" aria-hidden />,
      text: `${data.pastDue} usuario(s) con el pago fallido — clientes que sí querían pagar, revisa el reintento en Hotmart.`,
    });
  }

  const lifetimeLeft = Math.max(0, data.lifetimeTotal - data.lifetimeUsers);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Panel del dueño</h1>
      <p className="text-sm text-muted-foreground">Solo tú puedes ver esta página.</p>

      {/* Avisos */}
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

      {/* 💰 FINANZAS */}
      <SectionTitle icon={<Wallet className="size-4 text-primary" aria-hidden />} title="Finanzas" />
      <p className="mb-2 text-xs text-muted-foreground">
        Estimado a partir de los planes activos. El ingreso real exacto está en Hotmart.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BigStat icon={Repeat} value={`${s}${data.estMrr.toLocaleString()}`} label="Ingreso mensual (MRR)" hero />
        <BigStat icon={Crown} value={`${s}${data.lifetimeRevenue.toLocaleString()}`} label="Ingreso de por vida" />
        <BigStat icon={Wallet} value={data.payingCustomers} label="Clientes pagando" />
        <BigStat icon={TrendingUp} value={`${s}${data.arpu.toFixed(2)}`} label="Ingreso medio/cliente" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <BigStat icon={Crown} value={`${data.lifetimeUsers}/${data.lifetimeTotal}`} label="Cupos de por vida vendidos" />
        <BigStat value={lifetimeLeft} label="Cupos de por vida libres" />
        <BigStat icon={Percent} value={`${data.conversionPct}%`} label="Conversión registro → pago" />
      </div>

      {/* 📈 CRECIMIENTO */}
      <SectionTitle icon={<UserPlus className="size-4 text-primary" aria-hidden />} title="Crecimiento" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BigStat icon={Users} value={data.totalUsers} label="Usuarios totales" hero />
        <BigStat icon={UserPlus} value={data.newSignups7d} label="Altas últimos 7 días" />
        <BigStat icon={UserPlus} value={data.newSignups30d} label="Altas últimos 30 días" />
        <BigStat value={data.voluntaryChurn30d} label="Cancelaciones (30d)" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <BigStat value={data.usersByPlan.free || 0} label="En plan Gratis" />
        <BigStat value={data.pastDue} label="Pago fallido ahora" />
        <BigStat value={data.refundedOrChargeback30d} label="Reembolsos/contracargos (30d)" />
      </div>

      {/* 📣 MARKETING */}
      <SectionTitle icon={<Megaphone className="size-4 text-primary" aria-hidden />} title="De dónde vienen" />
      <div className="rounded-xl border border-border bg-card p-4">
        {data.utmSources.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay registros.</p>
        ) : (
          <ul className="space-y-2.5">
            {data.utmSources.map((u) => {
              const pct = data.totalUsers ? Math.round((u.count / data.totalUsers) * 100) : 0;
              return (
                <li key={u.source} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 truncate text-sm font-medium text-foreground capitalize">
                    {u.source}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-14 shrink-0 text-right text-xs text-muted-foreground">
                    {u.count} · {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Marca tus enlaces con <code>?utm_source=instagram</code> (o tiktok, youtube…) para separar cada canal.
          Sin etiqueta, se detecta por el sitio de origen o se marca “directo”.
        </p>
      </div>

      {/* ⚙️ OPERACIÓN */}
      <SectionTitle icon={<Sparkles className="size-4 text-primary" aria-hidden />} title="Operación" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Sparkles className="size-4 text-primary" aria-hidden /> Asistente IA — uso de hoy
          </p>
          <p className="text-sm text-foreground">
            {data.assistantMessagesToday} de {data.assistantGlobalLimit} mensajes
            {data.assistantPaused ? " — PAUSADO" : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            Cambia el tope en <code>ASSISTANT_GLOBAL_DAILY_LIMIT</code>.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Webhook de Hotmart</p>
          <p className="text-sm text-foreground">
            {data.lastWebhookEventAt
              ? `Último evento: ${new Date(data.lastWebhookEventAt).toLocaleString("es")}`
              : "Sin eventos recibidos todavía."}
          </p>
          <p className="text-xs text-muted-foreground">{data.webhookEventsToday} eventos hoy.</p>
        </div>
      </div>

      {/* 👥 USUARIOS */}
      <SectionTitle icon={<Users className="size-4 text-primary" aria-hidden />} title="Usuarios" />
      <UsersTable initialUsers={data.users} />
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mt-6 mb-3 flex items-center gap-2">
      {icon}
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}

function BigStat({
  icon: Icon,
  value,
  label,
  hero,
}: {
  icon?: typeof Wallet;
  value: string | number;
  label: string;
  hero?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        hero ? "border-primary/30 bg-gradient-to-br from-accent to-card" : "border-border bg-card"
      }`}
    >
      {Icon && <Icon className="mb-2 size-4 text-primary" aria-hidden />}
      <p className="tabular-nums font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
