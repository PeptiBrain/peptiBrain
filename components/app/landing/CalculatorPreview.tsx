"use client";

import { motion, useReducedMotion } from "motion/react";
import { Syringe } from "lucide-react";
import { SyringeVisual } from "@/components/app/calculator/SyringeVisual";

const ROWS = [
  { weeks: "1–4", mg: "0.25 mg", units: "10 U" },
  { weeks: "9–12", mg: "1 mg", units: "40 U" },
  { weeks: "17+", mg: "2.4 mg", units: "96 U" },
];

// Preview visual (no interactivo) de la calculadora de semaglutida para la portada.
// Usa la jeringa real de la app — se ve nítido, responsive y nunca se queda desfasado.
export function CalculatorPreview() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-sm rounded-[1.75rem] border border-border bg-card p-5 shadow-xl shadow-foreground/5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Syringe className="size-4 text-primary" aria-hidden /> Semaglutida
        </span>
        <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">GLP-1</span>
      </div>

      <p className="mt-3 rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
        Vial 5 mg · 2 mL → <span className="font-semibold tabular-nums">2.50</span> mg/mL
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/60 text-left uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-1.5 font-semibold">Sem.</th>
              <th className="px-3 py-1.5 font-semibold">Dosis</th>
              <th className="px-3 py-1.5 text-right font-semibold">Cargar</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.weeks} className={i === 0 ? "bg-primary/5" : "border-t border-border"}>
                <td className="px-3 py-2 text-muted-foreground">{r.weeks}</td>
                <td className="px-3 py-2 font-medium text-foreground tabular-nums">{r.mg}</td>
                <td className="px-3 py-2 text-right font-semibold text-primary tabular-nums">{r.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
        <p className="text-center text-[11px] text-muted-foreground">Semanas 1–4 · 0.25 mg</p>
        <p className="text-center font-display text-2xl font-bold tabular-nums text-primary">
          10 <span className="text-sm font-semibold text-muted-foreground">U</span>
        </p>
        <div className="mt-1.5">
          <SyringeVisual syringeType="u100" units={10} />
        </div>
      </div>
    </motion.div>
  );
}
