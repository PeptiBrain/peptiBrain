export const SYRINGE_CAPACITY: Record<"u30" | "u50" | "u100", number> = {
  u30: 30,
  u50: 50,
  u100: 100,
};
const CAPACITY = SYRINGE_CAPACITY;

export function SyringeVisual({
  syringeType,
  units,
}: {
  syringeType: "u30" | "u50" | "u100";
  units: number;
}) {
  const capacity = CAPACITY[syringeType];
  const overCapacity = units > capacity;
  const fillRatio = Math.min(1, units / capacity);
  const width = 280;
  const height = 64;
  const barrelX = 20;
  const barrelW = width - 40;

  const majorStep = capacity / 10;
  const ticks = Array.from({ length: 11 }, (_, i) => i * majorStep);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`Jeringa ${syringeType.toUpperCase()}: llenar hasta ${units.toFixed(1)} unidades`}>
        {/* Barril */}
        <rect x={barrelX} y={16} width={barrelW} height={24} rx={4} fill="none" stroke="var(--border)" strokeWidth={2} />
        {/* Relleno */}
        <rect
          x={barrelX}
          y={16}
          width={Math.max(0, barrelW * fillRatio)}
          height={24}
          rx={4}
          fill={overCapacity ? "var(--destructive)" : "var(--primary)"}
          opacity={0.85}
        />
        {/* Marcas */}
        {ticks.map((t, i) => {
          const x = barrelX + (t / capacity) * barrelW;
          return (
            <g key={i}>
              <line x1={x} y1={12} x2={x} y2={44} stroke="var(--muted-foreground)" strokeWidth={i % 5 === 0 ? 1.5 : 1} opacity={0.5} />
              {i % 5 === 0 && (
                <text x={x} y={58} fontSize="10" textAnchor="middle" fill="var(--muted-foreground)">
                  {t}
                </text>
              )}
            </g>
          );
        })}
        {/* Émbolo (marca del nivel actual) */}
        <line
          x1={barrelX + barrelW * fillRatio}
          y1={10}
          x2={barrelX + barrelW * fillRatio}
          y2={46}
          stroke="var(--foreground)"
          strokeWidth={2}
        />
      </svg>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Jeringa {syringeType.toUpperCase()} ({capacity} unidades)
      </p>
    </div>
  );
}
