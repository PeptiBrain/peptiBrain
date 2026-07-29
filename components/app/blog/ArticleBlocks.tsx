import type { ReactNode } from "react";
import { Info, Zap, BookMarked, ExternalLink } from "lucide-react";

// Bloques de contenido reutilizables para el cuerpo de los artículos del blog —
// evitan repetir las mismas clases de Tailwind en cada uno de los 7 artículos.
export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 font-display text-xl font-bold text-foreground sm:text-2xl">{children}</h2>;
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 font-display text-lg font-bold text-foreground">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-base leading-relaxed text-muted-foreground">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 space-y-2 pl-1">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 text-base leading-relaxed text-muted-foreground">
      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return <ol className="mt-4 space-y-3">{children}</ol>;
}

export function OLItem({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
        {n}
      </span>
      <span className="pt-0.5 text-base leading-relaxed text-muted-foreground">{children}</span>
    </li>
  );
}

// Respuesta directa al inicio del artículo (pirámide invertida): la conclusión
// en 2-3 líneas antes de desarrollarla, para lectores que escanean y para que
// un buscador/IA pueda citar la respuesta sin tener que leer todo el post.
export function Summary({
  children,
  label = "En resumen:",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="mt-5 flex gap-3 rounded-xl border-2 border-foreground/10 bg-card p-4">
      <Zap className="mt-0.5 size-4.5 shrink-0 text-primary" aria-hidden />
      <p className="text-sm leading-relaxed text-foreground">
        <span className="font-bold">{label} </span>
        {children}
      </p>
    </div>
  );
}

// Destaca un dato o matiz importante dentro del cuerpo del artículo (no es el
// aviso médico general, que va aparte al final — esto es para puntualizar algo).
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
      <Info className="mt-0.5 size-4.5 shrink-0 text-primary" aria-hidden />
      <p className="text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

export type Source = { title: string; url: string; note?: string };

// Bibliografía real al final del artículo — cada entrada es un estudio o
// revisión verificable (PubMed/PMC/NEJM/DOI), nunca una cita inventada. Si un
// artículo no tiene fuentes verificadas para citar, simplemente no lleva esta
// sección — mejor sin fuentes que con una fabricada.
export function Sources({ label, items }: { label: string; items: Source[] }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
        <BookMarked className="size-4.5 text-primary" aria-hidden /> {label}
      </h2>
      <ul className="mt-3 space-y-2.5">
        {items.map((s) => (
          <li key={s.url} className="text-sm leading-relaxed">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-start gap-1.5 font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              <span>{s.title}</span>
              <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            </a>
            {s.note && <span className="text-muted-foreground"> — {s.note}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
