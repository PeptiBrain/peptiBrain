import { Syringe, Droplet, Flame, HeartPulse, Calculator, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/app/Reveal";
import { AppShowcase } from "@/components/app/landing/AppShowcase";

const ICONS = [Syringe, Droplet, Flame, HeartPulse, Calculator, BarChart3];

export function Benefits() {
  const t = useTranslations("Benefits");

  const items = [1, 2, 3, 4, 5, 6].map((n) => ({
    icon: ICONS[n - 1],
    title: t(`item${n}Title`),
    body: t(`item${n}Body`),
  }));

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          {/* Visual de la app */}
          <div className="order-1">
            <AppShowcase />
          </div>

          {/* Tarjetas de beneficios */}
          <div className="order-2 grid gap-4 sm:grid-cols-2">
            {items.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-border bg-card p-5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
                    <b.icon className="size-4.5 text-primary" aria-hidden />
                  </div>
                  <p className="mt-3 font-display text-base font-bold text-foreground">{b.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
