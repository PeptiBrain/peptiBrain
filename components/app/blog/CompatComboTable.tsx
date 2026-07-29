import type { CompatStatus } from "@/lib/stack-compatibility";

const STATUS_STYLE: Record<CompatStatus, string> = {
  studied: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  caution: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  avoid: "bg-red-500/15 text-red-700 dark:text-red-400",
  unknown: "bg-muted text-muted-foreground",
};

export type CompatComboRow = {
  a: string;
  b: string;
  status: CompatStatus;
  statusLabel: string;
  note: string;
};

// Tabla real (no datos metidos en una imagen) con los combos más consultados
// de la herramienta de Compatibilidad — cada fila es la misma nota que ya
// existe en lib/stack-compatibility.ts, no un dato inventado para el artículo.
export function CompatComboTable({ rows }: { rows: CompatComboRow[] }) {
  return (
    <div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[560px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Combo
            </th>
            <th className="pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Estado
            </th>
            <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Nota
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.a}|${row.b}`} className="border-t border-border">
              <th scope="row" className="whitespace-nowrap py-3 pr-3 text-left font-semibold text-foreground">
                {row.a} + {row.b}
              </th>
              <td className="py-3 pr-3 align-top">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[row.status]}`}>
                  {row.statusLabel}
                </span>
              </td>
              <td className="py-3 align-top text-sm leading-relaxed text-muted-foreground">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
