"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { AdminOverview } from "@/lib/admin-data";
import { UsersTable } from "@/components/app/admin/UsersTable";

type Tab = "all" | "users" | "acq" | "finance";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "users", label: "Usuarios" },
  { key: "acq", label: "Adquisición" },
  { key: "finance", label: "Finanzas" },
];

const PLATFORM_COLOR: Record<string, string> = {
  iOS: "#0ea5e9",
  Android: "#22c55e",
  Escritorio: "#8b5cf6",
  desconocido: "#94a3b8",
};

export function AdminDashboard({ data, alerts }: { data: AdminOverview; alerts: string[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const s = data.currencySymbol;
  const lifetimeLeft = Math.max(0, data.lifetimeTotal - data.lifetimeUsers);

  const showUsers = tab === "all" || tab === "users";
  const showAcq = tab === "all" || tab === "acq";
  const showFinance = tab === "all" || tab === "finance";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">Panel de control</h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
        <span className="inline-block size-2 animate-pulse rounded-full bg-green-500" /> Datos en vivo · solo para ti
      </p>

      {/* Pestañas de filtro (estilo Bola 2026) */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tt) => (
          <button
            key={tt.key}
            type="button"
            onClick={() => setTab(tt.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === tt.key
                ? "bg-[#0f1115] text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {tt.label}
          </button>
        ))}
      </div>

      {/* Avisos */}
      {alerts.length > 0 ? (
        <ul className="mt-4 space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          {alerts.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden /> {a}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          <CheckCircle2 className="size-4" aria-hidden /> Todo en orden hoy.
        </p>
      )}

      {/* FINANZAS */}
      {showFinance && (
        <Section title="Finanzas" note="Estimado a partir de los planes activos. El ingreso real exacto está en Hotmart.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BolaCard
              label="Ingreso mensual · MRR"
              value={`${s}${data.estMrr.toLocaleString()}`}
              breakdown={[
                { label: "Premium", value: `${data.premiumActive}`, color: "#22c55e" },
                { label: "Family", value: `${data.familyActive}`, color: "#0ea5e9" },
              ]}
              accent
            />
            <BolaCard
              label="Ingreso de por vida · Bruto"
              value={`${s}${data.lifetimeRevenue.toLocaleString()}`}
              breakdown={[
                { label: "Cupos vendidos", value: `${data.lifetimeUsers}/${data.lifetimeTotal}`, color: "#8b5cf6" },
                { label: "Libres", value: `${lifetimeLeft}`, color: "#94a3b8" },
              ]}
            />
            <BolaCard label="Clientes pagando" value={`${data.payingCustomers}`} />
            <BolaCard
              label="Conversión · Registro → pago"
              value={`${data.conversionPct}%`}
              breakdown={[{ label: "Ingreso medio/cliente", value: `${s}${data.arpu.toFixed(2)}`, color: "#22c55e" }]}
            />
          </div>
        </Section>
      )}

      {/* USUARIOS */}
      {showUsers && (
        <Section title="Usuarios">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BolaCard
              label="Usuarios · Total"
              value={data.totalUsers.toLocaleString()}
              breakdown={data.platforms.map((p) => ({
                label: p.platform,
                value: `${p.count}`,
                color: PLATFORM_COLOR[p.platform] || "#94a3b8",
              }))}
              accent
            />
            <BolaCard
              label="Altas recientes"
              value={`+${data.newSignups7d}`}
              sub="últimos 7 días"
              breakdown={[
                { label: "Últimos 30 días", value: `+${data.newSignups30d}`, color: "#22c55e" },
                { label: "Cancelaciones (30d)", value: `${data.voluntaryChurn30d}`, color: "#ef4444" },
              ]}
            />
          </div>

          {/* Países */}
          <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              De qué países
            </p>
            {data.countries.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no hay registros.</p>
            ) : (
              <ul className="space-y-2.5">
                {data.countries.map((c) => {
                  const pct = data.totalUsers ? Math.round((c.count / data.totalUsers) * 100) : 0;
                  return (
                    <li key={c.country} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 truncate text-sm font-medium text-slate-700">
                        {c.flag} {c.country}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#0f1115]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-14 shrink-0 text-right text-xs text-slate-400">
                        {c.count} · {pct}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Todos los usuarios
            </p>
            <UsersTable initialUsers={data.users} />
          </div>
        </Section>
      )}

      {/* ADQUISICIÓN */}
      {showAcq && (
        <Section title="Adquisición · De dónde vienen">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            {data.utmSources.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no hay registros.</p>
            ) : (
              <ul className="space-y-2.5">
                {data.utmSources.map((u) => {
                  const pct = data.totalUsers ? Math.round((u.count / data.totalUsers) * 100) : 0;
                  return (
                    <li key={u.source} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 truncate text-sm font-medium text-slate-700 capitalize">
                        {u.source}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-14 shrink-0 text-right text-xs text-slate-400">
                        {u.count} · {pct}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-4 text-xs text-slate-400">
              Marca tus enlaces con{" "}
              <code className="rounded bg-slate-100 px-1">?utm_source=instagram</code> (o tiktok, youtube…) para
              separar cada canal. Sin etiqueta, se detecta por el sitio de origen o se marca “directo”.
            </p>
          </div>
        </Section>
      )}

      {/* OPERACIÓN (siempre) */}
      {tab === "all" && (
        <Section title="Operación">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Asistente IA · Hoy</p>
              <p className="mt-1 font-display text-2xl font-bold text-slate-900">
                {data.assistantMessagesToday}
                <span className="text-base font-medium text-slate-400"> / {data.assistantGlobalLimit}</span>
              </p>
              <p className="text-xs text-slate-500">
                mensajes {data.assistantPaused ? "· PAUSADO (tope alcanzado)" : ""}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Webhook Hotmart</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {data.lastWebhookEventAt
                  ? `Último: ${new Date(data.lastWebhookEventAt).toLocaleString("es")}`
                  : "Sin eventos aún."}
              </p>
              <p className="text-xs text-slate-500">{data.webhookEventsToday} eventos hoy.</p>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
      {note && <p className="mb-3 text-xs text-slate-400">{note}</p>}
      <div className={note ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

function BolaCard({
  label,
  value,
  sub,
  breakdown,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  breakdown?: { label: string; value: string; color: string }[];
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ring-1 ring-slate-200 ${
        accent ? "bg-gradient-to-br from-white to-slate-50" : "bg-white"
      }`}
    >
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 font-display text-4xl font-bold tracking-tight text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
      {breakdown && breakdown.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {breakdown.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="size-2 shrink-0 rounded-full" style={{ background: b.color }} />
              <span className="text-slate-500">{b.label}</span>
              <span className="ml-auto font-semibold text-slate-800">{b.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
