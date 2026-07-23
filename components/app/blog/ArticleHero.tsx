import type { LucideIcon } from "lucide-react";

// Ilustración de marca del artículo — icono + degradado verde, sin fotos externas
// (decisión: en salud/bienestar las fotos genéricas de IA restan confianza; un
// icono limpio en el verde de PeptiBrain es coherente con el resto de la web).
export function ArticleHero({ icon: Icon, category }: { icon: LucideIcon; category: string }) {
  return (
    <div
      className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl sm:h-56"
      style={{ background: "linear-gradient(135deg, #1CD39C 0%, #00A87E 100%)" }}
    >
      <div
        aria-hidden
        className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-10 -left-10 size-48 rounded-full bg-black/5 blur-2xl"
      />
      <div className="relative flex flex-col items-center gap-3">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-white/95 shadow-lg">
          <Icon className="size-8 text-[#00A87E]" aria-hidden />
        </span>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {category}
        </span>
      </div>
    </div>
  );
}
