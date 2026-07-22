"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { ADMIN } from "@/components/app/admin/AdminCharts";
import type { HotmartSummary } from "@/lib/hotmart-api";

const CUR: Record<string, string> = { EUR: "€", USD: "$", BRL: "R$" };

// Ventas REALES de Hotmart (vs las estimadas del resto de "Finanzas"). Se carga
// desde el endpoint admin cacheado; muestra su estado con honestidad.
export function HotmartSalesCard() {
  const [data, setData] = useState<HotmartSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/hotmart-summary")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const card = { background: ADMIN.surface, border: `1px solid ${ADMIN.border}` };
  const cur = data ? CUR[data.currency] || data.currency + " " : "€";

  return (
    <div className="rounded-2xl p-5" style={card}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
          Ventas reales · Hotmart
        </p>
        {data?.ok && (
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: "rgba(52,211,153,0.12)", color: ADMIN.positive }}
          >
            <CheckCircle2 className="size-3.5" aria-hidden /> En vivo
          </span>
        )}
      </div>

      {loading ? (
        <p className="mt-3 flex items-center gap-2 text-sm" style={{ color: ADMIN.textMuted }}>
          <Loader2 className="size-4 animate-spin" aria-hidden /> Cargando de Hotmart…
        </p>
      ) : !data || !data.configured ? (
        <p className="mt-2 text-sm" style={{ color: ADMIN.textMuted }}>
          No conectado. Pon las credenciales de API de Hotmart en el servidor para ver aquí tus ventas reales (en vez de
          las estimadas de arriba).
        </p>
      ) : !data.ok ? (
        <p className="mt-2 text-sm" style={{ color: ADMIN.warning }}>
          Conectado, pero Hotmart no devolvió datos ahora mismo. Puede ser un límite temporal — se reintenta solo en unos
          minutos.
        </p>
      ) : (
        <>
          <p className="mt-1 font-display text-4xl font-bold tracking-tight tabular-nums" style={{ color: ADMIN.text }}>
            {cur}
            {data.revenueTotal.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: ADMIN.textMuted }}>
            facturado en total (real, solo productos PeptiBrain)
          </p>
          <div className="mt-3 space-y-1.5 text-sm">
            <Row label="Este mes" value={`${cur}${data.revenueThisMonth.toLocaleString()}`} color={ADMIN.positive} />
            <Row label="Ventas aprobadas" value={`${data.salesCount}`} color="#60A5FA" />
            <Row label="Reembolsos / contracargos" value={`${data.refundsCount}`} color={ADMIN.negative} />
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-2 shrink-0 rounded-full" style={{ background: color }} />
      <span style={{ color: ADMIN.textMuted }}>{label}</span>
      <span className="ml-auto font-semibold" style={{ color: ADMIN.text }}>
        {value}
      </span>
    </div>
  );
}
