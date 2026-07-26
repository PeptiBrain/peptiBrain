import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/app/LocaleSwitcher";
import { ToolsMenu } from "@/components/app/ToolsMenu";
import { HeaderAuthCta } from "@/components/app/HeaderAuthCta";

// Sin lectura de sesión en servidor: eso volvía dinámica TODA la web pública
// (leer cookies obliga a renderizar en cada visita). La decisión de mostrar
// "Empezar gratis" o "Ir a mi app" vive ahora en HeaderAuthCta, del lado del
// navegador, y la landing/blog/calculadoras pueden servirse cacheadas.
export async function Header() {
  const t = await getTranslations("Header");

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
        <nav aria-label="Navegación principal" className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
          >
            {t("home")}
          </Link>
          <ToolsMenu triggerLabel={t("tools")} />
          <Link
            href="/blog"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
          >
            Blog
          </Link>
          <LocaleSwitcher />
          <HeaderAuthCta
            loginLabel={t("login")}
            ctaLabel={t("cta")}
            goToAppLabel={t("goToApp")}
          />
        </nav>
      </div>
    </header>
  );
}
