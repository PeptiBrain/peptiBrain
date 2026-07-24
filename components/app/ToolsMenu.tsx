"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Calculator, Syringe, Shuffle, ListChecks, Clock, Coins } from "lucide-react";
import { Link } from "@/i18n/navigation";

const TOOLS = [
  { href: "/calculadora", labelKey: "navCalculator" as const, icon: Calculator },
  { href: "/calculadora-semaglutida", labelKey: "navSemaglutide" as const, icon: Syringe },
  { href: "/comparador", labelKey: "navComparador" as const, icon: Shuffle },
  { href: "/protocolos", labelKey: "navProtocols" as const, icon: ListChecks },
  { href: "/calculadora-eliminacion", labelKey: "navClearance" as const, icon: Clock },
  { href: "/calculadora-costo-mg", labelKey: "navCostPerMg" as const, icon: Coins },
];

// Menú desplegable "Herramientas" del header — reemplaza el enlace suelto
// "Gratis" para dar acceso directo a las 4 herramientas públicas gratuitas.
export function ToolsMenu({ triggerLabel }: { triggerLabel: string }) {
  const t = useTranslations("Tools");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {triggerLabel} <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-border bg-popover p-1.5 shadow-lg"
        >
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <tool.icon className="size-4 shrink-0 text-primary" aria-hidden />
              {t(tool.labelKey)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
