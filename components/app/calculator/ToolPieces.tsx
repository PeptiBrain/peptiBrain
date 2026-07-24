import { AlertTriangle, ArrowRight, Calculator, ListChecks, Syringe, Shuffle, Clock, Coins } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

// Aviso legal transversal de todas las herramientas: NO es consejo médico.
export async function ToolDisclaimer() {
  const t = await getTranslations("Tools");
  return (
    <div className="mt-6 flex gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">{t("disclaimer")}</p>
    </div>
  );
}

// Banner de conversión hacia la app.
export async function ToolCta() {
  const t = await getTranslations("Tools");
  return (
    <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center sm:p-8">
      <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">{t("ctaTitle")}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("ctaBody")}</p>
      <Link
        href="/login"
        className="mt-5 inline-flex h-12 items-center justify-center gap-1.5 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
      >
        {t("ctaButton")} <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

// FAQ con datos estructurados los inyecta la página; aquí solo el render visual.
export async function ToolFaq({ items }: { items: { q: string; a: string }[] }) {
  const t = await getTranslations("Tools");
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold text-foreground">{t("faqTitle")}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item, i) => (
          <details key={i} className="group rounded-xl border border-border bg-card p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:hidden">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// Enlaces cruzados entre las herramientas gratuitas (bueno para el usuario y para SEO).
export async function ToolCrossLinks({
  current,
}: {
  current: "calc" | "sema" | "protocolos" | "comparador" | "eliminacion" | "costomg";
}) {
  const t = await getTranslations("Tools");
  const links = [
    { key: "calc" as const, href: "/calculadora", label: t("navCalculator"), icon: Calculator },
    { key: "sema" as const, href: "/calculadora-semaglutida", label: t("navSemaglutide"), icon: Syringe },
    { key: "protocolos" as const, href: "/protocolos", label: t("navProtocols"), icon: ListChecks },
    { key: "comparador" as const, href: "/comparador", label: t("navComparador"), icon: Shuffle },
    { key: "eliminacion" as const, href: "/calculadora-eliminacion", label: t("navClearance"), icon: Clock },
    { key: "costomg" as const, href: "/calculadora-costo-mg", label: t("navCostPerMg"), icon: Coins },
  ].filter((l) => l.key !== current);

  return (
    <section className="mt-10">
      <h2 className="font-display text-lg font-bold text-foreground">{t("moreTools")}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.key}
            href={l.href}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <l.icon className="size-5" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-foreground">{l.label}</span>
            <ArrowRight className="ml-auto size-4 text-muted-foreground" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}

// Inyecta JSON-LD (schema.org) en la página. Datos estructurados para rich results.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
