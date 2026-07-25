// Esqueleto de carga con la FORMA del contenido real. Sustituye al
// `return null` que dejaba la pantalla en blanco mientras se leían los datos:
// el tiempo de espera es el mismo, pero se percibe mucho más corto porque el
// usuario ve de inmediato la estructura de la pantalla en vez de un vacío.
// (15-PATRONES-UX: skeleton screens > spinner genérico; CLS = 0 porque las
// piezas ocupan el mismo espacio que el contenido que las reemplaza.)

function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-secondary ${className}`} />;
}

export function PageSkeleton({
  tabs = false,
  cards = 3,
  narrow = false,
}: {
  /** Fila de pastillas de sub-navegación (Péptidos, Salud). */
  tabs?: boolean;
  /** Cuántos bloques de contenido dibujar. */
  cards?: number;
  /** Columna estrecha (Cuenta) en vez del ancho normal. */
  narrow?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`mx-auto ${narrow ? "max-w-md" : "max-w-3xl"} animate-pulse px-4 py-5 motion-reduce:animate-none`}
    >
      {/* Encabezado: título + subtítulo */}
      <Bar className="h-6 w-40" />
      <Bar className="mt-2 h-4 w-56" />

      {tabs && (
        <div className="mt-4 flex gap-2 overflow-hidden">
          <Bar className="h-9 w-24 shrink-0 rounded-full" />
          <Bar className="h-9 w-24 shrink-0 rounded-full" />
          <Bar className="h-9 w-24 shrink-0 rounded-full" />
          <Bar className="h-9 w-24 shrink-0 rounded-full" />
        </div>
      )}

      <div className="mt-4 space-y-3">
        {Array.from({ length: cards }).map((_, i) => (
          <Bar key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
