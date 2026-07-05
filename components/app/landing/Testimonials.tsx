import Image from "next/image";
import { useTranslations } from "next-intl";
import { Quote, UserPlus } from "lucide-react";
import { Reveal } from "@/components/app/Reveal";

const PEOPLE = [
  { key: "viviana", name: "Viviana Pinto", photo: "/testimonials/viviana.jpg" },
  { key: "marco", name: "Marco Polo", photo: "/testimonials/marco.jpg" },
  { key: "isa", name: "Isa Toledo", photo: "/testimonials/isa.jpg" },
] as const;

const RESERVED = 3 - PEOPLE.length;

export function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PEOPLE.map((person, i) => (
            <Reveal key={person.name} delay={i * 0.06}>
              <figure className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
                <Quote className="size-5 text-primary" aria-hidden />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                  {t(`${person.key}.quote`)}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <Image
                    src={person.photo}
                    alt={t("photoAlt", { name: person.name })}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {person.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {t(`${person.key}.role`)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}

          {Array.from({ length: RESERVED }).map((_, i) => (
            <Reveal key={`reserved-${i}`} delay={(PEOPLE.length + i) * 0.06}>
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border p-5 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary">
                  <UserPlus className="size-5 text-muted-foreground" aria-hidden />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{t("reservedTitle")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("reservedBody")}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
