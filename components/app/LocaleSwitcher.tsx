"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { FlagIcon } from "@/components/app/FlagIcon";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: string) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary p-0.5">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={locale === l ? "true" : undefined}
          aria-label={l === "es" ? "Cambiar a Español" : "Switch to English"}
          className={`flex items-center justify-center rounded-full p-1.5 transition-colors ${
            locale === l ? "bg-card shadow-sm" : "opacity-50 hover:opacity-80"
          }`}
        >
          <FlagIcon locale={l} className="h-3.5 w-5 rounded-[2px]" />
        </button>
      ))}
    </div>
  );
}
