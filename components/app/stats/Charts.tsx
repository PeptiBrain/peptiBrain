"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Bucket } from "@/lib/stats";

// Gráfica de barras vertical (dosis por periodo). Solo color de marca.
export function BarChart({ data }: { data: Bucket[] }) {
  const reduce = useReducedMotion();
  const max = Math.max(1, ...data.map((d) => d.value));
  // Si hay muchas barras, mostrar etiquetas salteadas para que no se amontonen.
  const labelEvery = data.length > 8 ? Math.ceil(data.length / 6) : 1;

  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div className="relative flex h-32 w-full items-end justify-center">
              <motion.div
                className="w-full max-w-[28px] rounded-t-md bg-primary"
                initial={reduce ? false : { height: 0 }}
                animate={{ height: `${Math.max(pct, d.value > 0 ? 6 : 2)}%` }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                style={{ opacity: d.value > 0 ? 1 : 0.15 }}
              />
              {d.value > 0 && (
                <span className="absolute -top-4 text-[10px] font-semibold text-foreground">{d.value}</span>
              )}
            </div>
            <span className="w-full truncate text-center text-[9px] text-muted-foreground">
              {i % labelEvery === 0 ? d.label : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type Slice = { label: string; value: number };

// Donut / "quesito": reparto por péptido. Tonos del color de marca.
export function DonutChart({ data, centerLabel, centerValue }: { data: Slice[]; centerLabel: string; centerValue: string }) {
  const reduce = useReducedMotion();
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const opacities = [1, 0.75, 0.55, 0.4, 0.28, 0.2];

  let offset = 0;
  const segments = data.map((d, i) => {
    const frac = d.value / total;
    const seg = {
      dash: frac * circumference,
      gap: circumference - frac * circumference,
      offset: -offset * circumference,
      opacity: opacities[Math.min(i, opacities.length - 1)],
      label: d.label,
      value: d.value,
      pct: Math.round(frac * 100),
    };
    offset += frac;
    return seg;
  });

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <svg viewBox="0 0 100 100" className="size-28 -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--secondary)" strokeWidth="12" />
          {segments.map((s, i) => (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={s.opacity}
              strokeWidth="12"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
              initial={reduce ? false : { strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${s.dash} ${s.gap}` }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-bold text-foreground">{centerValue}</span>
          <span className="text-[10px] text-muted-foreground">{centerLabel}</span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 shrink-0 rounded-full bg-primary"
              style={{ opacity: opacities[Math.min(i, opacities.length - 1)] }}
            />
            <span className="min-w-0 flex-1 truncate text-foreground">{d.label}</span>
            <span className="shrink-0 font-medium text-muted-foreground">{segments[i].pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
