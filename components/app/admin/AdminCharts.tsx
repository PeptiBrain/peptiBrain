"use client";

import { motion, useReducedMotion } from "motion/react";

// Paleta fija del panel de admin — "sala de control" oscura, un solo acento (el
// verde de marca), semánticos solo en su función. No depende del tema claro/oscuro
// de la app de consumo: esta pantalla es solo para el dueño.
export const ADMIN = {
  bg: "#0B0D10",
  surface: "#14171C",
  surfaceHover: "#181C22",
  border: "#22262D",
  text: "#F2F3F5",
  textMuted: "#8B92A0",
  accent: "#00D9A3",
  positive: "#34D399",
  negative: "#F87171",
  warning: "#FBBF24",
};

// Gráfico de barras — altas por día (30 días). Solo el acento, sin ejes de sobra.
export function AdminBarChart({ data }: { data: { label: string; count: number }[] }) {
  const reduce = useReducedMotion();
  const max = Math.max(1, ...data.map((d) => d.count));
  const labelEvery = Math.ceil(data.length / 6);

  return (
    <div className="flex h-32 items-end gap-[3px]">
      {data.map((d, i) => {
        const pct = (d.count / max) * 100;
        return (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div className="relative flex h-24 w-full items-end justify-center">
              <motion.div
                className="w-full max-w-[10px] rounded-t-sm"
                style={{ background: ADMIN.accent, opacity: d.count > 0 ? 0.85 : 0.15 }}
                initial={reduce ? false : { height: 0 }}
                animate={{ height: `${Math.max(pct, d.count > 0 ? 8 : 3)}%` }}
                transition={{ duration: 0.5, delay: i * 0.012, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="w-full truncate text-center text-[9px]" style={{ color: ADMIN.textMuted }}>
              {i % labelEvery === 0 ? d.label : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Donut — distribución de planes.
export function AdminDonut({
  data,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number; color: string }[];
  centerLabel: string;
  centerValue: string;
}) {
  const reduce = useReducedMotion();
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d) => {
    const frac = d.value / total;
    const seg = {
      dash: frac * circumference,
      gap: circumference - frac * circumference,
      offset: -offset * circumference,
      color: d.color,
      label: d.label,
      value: d.value,
      pct: Math.round(frac * 100),
    };
    offset += frac;
    return seg;
  });

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        <svg viewBox="0 0 100 100" className="size-28 -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke={ADMIN.border} strokeWidth="12" />
          {segments.map((s, i) => (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
              strokeLinecap="butt"
              initial={reduce ? false : { strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${s.dash} ${s.gap}` }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-bold" style={{ color: ADMIN.text }}>
            {centerValue}
          </span>
          <span className="text-[9px]" style={{ color: ADMIN.textMuted }}>
            {centerLabel}
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="size-2 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="truncate" style={{ color: ADMIN.textMuted }}>
              {s.label}
            </span>
            <span className="ml-auto shrink-0 font-semibold tabular-nums" style={{ color: ADMIN.text }}>
              {s.value} · {s.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Barras de retención D1/D7/D30 — comparación simple, con umbral de referencia.
export function RetentionBars({
  values,
}: {
  values: { label: string; pct: number | null }[];
}) {
  const reduce = useReducedMotion();
  return (
    <div className="grid grid-cols-3 gap-3">
      {values.map((v, i) => (
        <div key={v.label} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium" style={{ color: ADMIN.textMuted }}>
              {v.label}
            </span>
            <span className="font-display text-sm font-bold tabular-nums" style={{ color: ADMIN.text }}>
              {v.pct == null ? "—" : `${v.pct}%`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: ADMIN.accent }}
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${v.pct ?? 0}%` }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
