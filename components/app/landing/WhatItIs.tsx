import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import { Reveal } from "@/components/app/Reveal";

// Bloque de confianza en dos columnas — comunica los límites legales (línea
// D2: la app ejecuta el protocolo, nunca lo sugiere) de forma visual en vez
// de un párrafo de disclaimer suelto. Mismos límites que ya vive en
// Tools.disclaimer, solo con más peso visual en la landing.
export function WhatItIs() {
  const t = useTranslations("WhatItIs");
  const yes = ["item1", "item2", "item3", "item4"] as const;
  const no = ["no1", "no2", "no3", "no4"] as const;

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Reveal delay={0.05}>
            <div className="h-full rounded-2xl border border-emerald-300/50 bg-emerald-50 p-6 dark:border-emerald-500/25 dark:bg-emerald-500/10">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-emerald-700 dark:text-emerald-400">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check className="size-4" aria-hidden />
                </span>
                {t("yesTitle")}
              </h3>
              <ul className="mt-4 space-y-3">
                {yes.map((key) => (
                  <li key={key} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-red-300/50 bg-red-50 p-6 dark:border-red-500/25 dark:bg-red-500/10">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-red-700 dark:text-red-400">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                  <X className="size-4" aria-hidden />
                </span>
                {t("noTitle")}
              </h3>
              <ul className="mt-4 space-y-3">
                {no.map((key) => (
                  <li key={key} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                    <X className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
