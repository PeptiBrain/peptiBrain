import { Check, X, Minus } from "lucide-react";

// Estado de cada celda: true=sí, false=no, null="no especificado" (nunca se
// adivina — si el artículo no lo afirma explícitamente, va guion, no check/cruz).
type Cell = boolean | null;

export type ComparisonRow = {
  label: string;
  values: Cell[];
};

function CellIcon({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check className="size-3.5" aria-hidden />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
        <X className="size-3.5" aria-hidden />
      </span>
    );
  }
  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
      <Minus className="size-3.5" aria-hidden />
    </span>
  );
}

// Tabla comparativa del artículo "mejores-apps-de-peptidos" — cada celda es
// exactamente lo que el propio artículo afirma sobre cada app, ni más ni menos:
// si el texto no lo dice explícitamente, la celda queda en "no especificado"
// (guion), nunca un check o una cruz inventados.
export function AppComparisonTable({
  columns,
  rows,
  unspecifiedLabel,
}: {
  columns: string[];
  rows: ComparisonRow[];
  unspecifiedLabel: string;
}) {
  return (
    <div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[560px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="w-32 sm:w-40" />
            {columns.map((col, i) => (
              <th
                key={col}
                className={`px-2 pb-3 text-center align-bottom font-display text-sm font-bold ${
                  i === 0 ? "rounded-t-xl bg-primary/10 text-primary" : "text-foreground"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="whitespace-nowrap py-3 pr-3 text-left text-xs font-semibold text-muted-foreground"
              >
                {row.label}
              </th>
              {row.values.map((val, cIdx) => (
                <td
                  key={cIdx}
                  className={`py-3 text-center ${cIdx === 0 ? "bg-primary/10" : ""} ${
                    cIdx === 0 && rIdx === rows.length - 1 ? "rounded-b-xl" : ""
                  }`}
                >
                  <div className="flex justify-center">
                    <CellIcon value={val} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Minus className="size-3" aria-hidden /> {unspecifiedLabel}
      </p>
    </div>
  );
}
