"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Flame,
  Dumbbell,
  Bandage,
  RefreshCcw,
  Sparkles,
  Moon,
  Brain,
  Heart,
  Salad,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplet,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/app/Reveal";
import { ModalShell } from "@/components/app/shell/ModalShell";
import { PEPTIDE_PROFILES, type PeptideProfile, type PeptideCategoryId } from "@/lib/peptide-profiles";

// Selección curada de los péptidos más buscados (mismo criterio que el
// artículo "peptidos-populares" del blog) — no los 24, para no saturar el
// carrusel de la portada.
const FEATURED_NAMES = [
  "Semaglutida",
  "Tirzepatida",
  "Retatrutida",
  "BPC-157",
  "TB-500",
  "GHK-Cu",
  "Ipamorelina",
  "CJC-1295",
  "Epitalon",
  "MK-677 (Ibutamoren)",
];

// Un solo ícono por categoría (no un color distinto por categoría — mantiene
// la disciplina cromática 60-30-10: la variedad viene del glifo, no del color).
const CATEGORY_ICONS: Record<PeptideCategoryId, LucideIcon> = {
  peso: Flame,
  musculo_gh: Dumbbell,
  recuperacion: Bandage,
  longevidad: RefreshCcw,
  sueno: Moon,
  piel_belleza: Sparkles,
  cognicion: Brain,
  libido: Heart,
  intestinal: Salad,
  inmunidad: ShieldCheck,
};

export function PeptideLibrary() {
  const t = useTranslations("PeptideLibrary");
  const tc = useTranslations("PeptideCategories");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [quickView, setQuickView] = useState<PeptideProfile | null>(null);

  const items = FEATURED_NAMES.map((name) => PEPTIDE_PROFILES.find((p) => p.name === name)).filter(
    (p): p is PeptideProfile => Boolean(p),
  );

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / items.length;
    setActive(Math.round(el.scrollLeft / cardWidth));
  }

  function scrollByCards(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / items.length;
    // Asignación directa (en vez de scrollBy con behavior:"smooth") — la
    // animación la da la clase CSS "scroll-smooth" del contenedor, que es
    // más fiable entre navegadores que la opción behavior de la Scroll API.
    el.scrollLeft += direction * cardWidth * 2;
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("eyebrow")}</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("title")}
              </h2>
            </div>
            <Link
              href="/protocolos"
              className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {t("seeAll")} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:hidden">{t("swipeHint")}</p>
        </Reveal>

        <div className="relative mt-6">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label={t("scrollPrev")}
            className="absolute -left-4 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted sm:flex"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label={t("scrollNext")}
            className="absolute -right-4 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted sm:flex"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((p, i) => {
            const Icon = CATEGORY_ICONS[p.categories[0]];
            return (
              <Reveal key={p.name} delay={i * 0.04}>
                <article className="flex w-64 shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-4">
                  <span className="w-fit rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                    {tc(p.categories[0])}
                  </span>
                  <span className="mt-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="size-7 text-primary" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-display text-base font-bold text-foreground">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickView(p)}
                      className="h-9 flex-1 rounded-lg border border-border text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      {t("quickView")}
                    </button>
                    <Link
                      href="/login"
                      className="flex h-9 flex-1 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground transition-transform active:scale-97"
                    >
                      {t("follow")}
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
            })}
          </div>
        </div>

        <div className="mt-4 hidden justify-center gap-1.5 sm:flex">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      </div>

      {quickView && (
        <ModalShell
          open={Boolean(quickView)}
          onClose={() => setQuickView(null)}
          title={quickView.name}
          icon={(() => {
            const Icon = CATEGORY_ICONS[quickView.categories[0]];
            return <Icon className="size-5 text-primary" aria-hidden />;
          })()}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">{quickView.description}</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
            <div>
              <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Droplet className="size-3" aria-hidden /> {t("fieldDose")}
              </dt>
              <dd className="font-medium text-foreground">
                {quickView.commonDose} {quickView.doseUnit}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Clock className="size-3" aria-hidden /> {t("fieldFreq")}
              </dt>
              <dd className="font-medium text-foreground">{quickView.frequency}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/login"
              className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {t("modalCta")}
            </Link>
            <Link
              href="/protocolos"
              className="flex h-11 items-center justify-center rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted"
            >
              {t("modalFullProtocol")}
            </Link>
          </div>
        </ModalShell>
      )}
    </section>
  );
}
