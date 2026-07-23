import type { LucideIcon } from "lucide-react";

// Ilustración de marca del artículo — icono + degradado verde, sin fotos externas
// (decisión: en salud/bienestar las fotos genéricas de IA restan confianza; un
// icono limpio en el verde de PeptiBrain es coherente con el resto de la web).
// `compact` = versión más baja para tarjetas de grid (índice del blog).
export function ArticleHero({
  icon: Icon,
  category,
  compact = false,
}: {
  icon: LucideIcon;
  category: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${
        compact ? "h-32" : "h-48 sm:h-56"
      }`}
      style={{ background: "linear-gradient(135deg, #1CD39C 0%, #00A87E 100%)" }}
    >
      <div
        aria-hidden
        className={`absolute -right-8 -top-8 rounded-full bg-white/10 blur-2xl ${compact ? "size-24" : "size-40"}`}
      />
      <div
        aria-hidden
        className={`absolute -bottom-10 -left-10 rounded-full bg-black/5 blur-2xl ${compact ? "size-28" : "size-48"}`}
      />
      <div className={`relative flex flex-col items-center ${compact ? "gap-2" : "gap-3"}`}>
        <span
          className={`flex items-center justify-center rounded-2xl bg-white/95 shadow-lg ${
            compact ? "size-11" : "size-16"
          }`}
        >
          <Icon className={compact ? "size-5 text-[#00A87E]" : "size-8 text-[#00A87E]"} aria-hidden />
        </span>
        {!compact && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {category}
          </span>
        )}
      </div>
    </div>
  );
}
