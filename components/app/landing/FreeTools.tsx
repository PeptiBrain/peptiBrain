import { useTranslations } from "next-intl";
import { Calculator, Syringe, ListChecks, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/app/Reveal";
import { CalculatorPreview } from "@/components/app/landing/CalculatorPreview";

// Sección de la portada: muestra las 3 herramientas gratis (imán de conversión + SEO).
export function FreeTools() {
  const t = useTranslations("FreeToolsSection");

  const tools = [
    { href: "/calculadora", icon: Calculator, title: t("t1Title"), desc: t("t1Desc") },
    { href: "/calculadora-semaglutida", icon: Syringe, title: t("t2Title"), desc: t("t2Desc") },
    { href: "/protocolos", icon: ListChecks, title: t("t3Title"), desc: t("t3Desc") },
  ];

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-primary">{t("eyebrow")}</p>
          <h2 className="mx-auto mt-1 max-w-2xl text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-center text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Tarjetas de herramientas */}
          <div className="order-2 space-y-3 lg:order-1">
            {tools.map((tool, i) => (
              <Reveal key={tool.href} delay={i * 0.07}>
                <Link
                  href={tool.href}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <tool.icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold text-foreground">{tool.title}</span>
                    <span className="block text-sm text-muted-foreground">{tool.desc}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
                    <span className="hidden sm:inline">{t("try")}</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
            <p className="pt-1 text-center text-xs text-muted-foreground lg:text-left">{t("noSignup")}</p>
          </div>

          {/* Preview visual de la calculadora */}
          <div className="order-1 lg:order-2">
            <CalculatorPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
