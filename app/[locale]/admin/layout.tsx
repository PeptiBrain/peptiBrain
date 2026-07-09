import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

// Layout DEDICADO del panel de control — deliberadamente distinto a la app del
// usuario (barra oscura, sin la navegación de péptidos/salud/etc).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f5f5f4]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0f1115] text-slate-100">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
            </div>
            <span className="font-display text-sm font-bold">PeptiBrain · Panel</span>
          </div>
          <Link
            href="/app"
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Volver a la app
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
