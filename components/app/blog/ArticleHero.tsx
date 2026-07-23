import Image from "next/image";
import type { LucideIcon } from "lucide-react";

// Ilustración de portada del artículo. Si el post ya tiene una imagen real
// generada (public/blog/<slug>.png), se muestra esa; si no, cae al icono +
// degradado verde de siempre (decisión: en salud/bienestar las fotos
// genéricas de IA restan confianza, así que el fallback nunca es una foto
// externa, solo el icono de marca).
// `compact` = versión más baja para tarjetas de grid (índice del blog).
export function ArticleHero({
  icon: Icon,
  category,
  image,
  compact = false,
}: {
  icon: LucideIcon;
  category: string;
  image?: string | null;
  compact?: boolean;
}) {
  if (image) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${compact ? "h-32" : "h-48 sm:h-56"}`}>
        <Image
          src={image}
          alt=""
          fill
          sizes={compact ? "(max-width: 640px) 100vw, 400px" : "(max-width: 640px) 100vw, 800px"}
          className="object-cover"
          priority={!compact}
        />
        {!compact && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>
    );
  }

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
