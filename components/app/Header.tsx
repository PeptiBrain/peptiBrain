import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/app/LocaleSwitcher";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header
      role="banner"
      className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/peptibrain-isotipo.svg" alt="" width={32} height={32} priority />
          <span className="hidden font-display text-lg font-bold tracking-tight text-foreground sm:inline">
            PeptiBrain
          </span>
        </Link>
        <nav aria-label="Navegación principal" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <Link
            href="/login"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
          >
            {t("login")}
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-97 sm:px-4"
          >
            {t("cta")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
