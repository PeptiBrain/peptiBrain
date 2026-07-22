import { Flame, TrendingDown, TrendingUp, Droplet } from "lucide-react";

const BARS = [70, 100, 85, 100, 100, 60, 90]; // adherencia por día (%)
const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

// Maqueta de una pantalla de la app (Progreso) para la portada. Estática (sin depender
// de animaciones JS) → se ve nítida y correcta siempre, como el HeroPanel.
export function AppShowcase() {
  const C = 2 * Math.PI * 42; // circunferencia del anillo
  const pct = 92;

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Marco tipo pantalla */}
      <div className="rounded-[2rem] border border-border bg-card p-5 shadow-xl shadow-foreground/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Tu progreso</p>
            <p className="font-display text-lg font-bold text-foreground">Esta semana</p>
          </div>
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
            7 días
          </span>
        </div>

        {/* Anillo de adherencia */}
        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border/70 p-4">
          <div className="relative size-24 shrink-0">
            <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - pct / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-bold tabular-nums text-foreground">{pct}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Adherencia</p>
            <p className="mt-0.5 text-xs text-muted-foreground">23 de 25 dosis a tiempo</p>
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
              <TrendingUp className="size-3.5" aria-hidden /> 8% vs semana pasada
            </p>
          </div>
        </div>

        {/* Racha + peso */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/70 p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame className="size-3.5 text-orange-500" aria-hidden /> Racha
            </p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">12 días</p>
          </div>
          <div className="rounded-2xl border border-border/70 p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingDown className="size-3.5 text-primary" aria-hidden /> Peso
            </p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">−3.2 kg</p>
          </div>
        </div>

        {/* Mini gráfico de la semana (alturas fijas en px) */}
        <div className="mt-3 rounded-2xl border border-border/70 p-3">
          <p className="mb-2 text-xs text-muted-foreground">Dosis a tiempo por día</p>
          <div className="flex items-end justify-between gap-1.5" style={{ height: 52 }}>
            {BARS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-primary"
                style={{ height: Math.round((h / 100) * 48), opacity: h >= 100 ? 1 : 0.55 }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between gap-1.5">
            {DAYS.map((d, i) => (
              <span key={i} className="flex-1 text-center text-[9px] text-muted-foreground">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pill flotante: vial */}
      <div className="absolute -bottom-4 -left-3 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-lg shadow-foreground/10">
        <Droplet
          className="size-4 text-primary"
          aria-hidden
          style={{ fill: "color-mix(in oklab, var(--primary) 15%, transparent)" }}
        />
        <span className="text-xs text-foreground">
          <b className="font-semibold">Semaglutida</b> · caduca en 4 d
        </span>
      </div>
    </div>
  );
}
