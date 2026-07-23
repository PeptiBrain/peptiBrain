import { useTranslations } from "next-intl";
import { Atom, Syringe, LineChart } from "lucide-react";
import { Reveal } from "@/components/app/Reveal";

const STEP_ICONS = [Atom, Syringe, LineChart];

export function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const steps = [1, 2, 3].map((n) => ({
    title: t(`step${n}Title`),
    body: t(`step${n}Body`),
    icon: STEP_ICONS[n - 1],
  }));

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-center text-xs font-semibold tracking-wide text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15">
                  <s.icon className="size-5 text-primary" aria-hidden />
                </span>
                <span className="font-display text-3xl font-extrabold text-primary">{i + 1}</span>
              </div>
              <p className="mt-3 font-display text-base font-bold text-foreground">{s.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
