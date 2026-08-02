import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getLocalizedPath } from "@/i18n/routing";
import { ShieldAlert } from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");
  const tt = useTranslations("Tools");
  const tq = useTranslations("QuienesSomos");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <>
      <div className="px-4 pb-8">
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border border-[var(--notice-border)] bg-[var(--notice-bg)] p-4">
          <ShieldAlert
            className="mt-0.5 size-5 shrink-0 text-[var(--notice-icon)]"
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-[var(--notice-text)]">{t("legalNotice")}</p>
        </div>
      </div>

      <footer role="contentinfo" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/peptibrain-isotipo.svg" alt="" width={26} height={26} />
                <span className="font-display text-base font-bold text-foreground">PeptiBrain</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t("tagline")}
              </p>
              <div className="mt-5 flex items-center gap-4">
                <a
                  href="https://www.instagram.com/peptibrain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("instagram")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <InstagramIcon className="size-5" aria-hidden />
                </a>
                <a
                  href="https://www.tiktok.com/@peptibrainapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("tiktok")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <TikTokIcon className="size-5" aria-hidden />
                </a>
              </div>
            </div>

            <FooterColumn title={t("colProduct")}>
              <FooterLink href={getLocalizedPath("/herramientas", locale)}>{tt("navAllTools")}</FooterLink>
              <FooterLink href={getLocalizedPath("/calculadora", locale)}>{tt("navCalculator")}</FooterLink>
              <FooterLink href={getLocalizedPath("/calculadora-semaglutida", locale)}>{tt("navSemaglutide")}</FooterLink>
              <FooterLink href={getLocalizedPath("/comparador", locale)}>{tt("navComparador")}</FooterLink>
              <FooterLink href={getLocalizedPath("/compatibilidad", locale)}>{tt("navCompat")}</FooterLink>
              <FooterLink href={getLocalizedPath("/protocolos", locale)}>{tt("navProtocols")}</FooterLink>
              <FooterLink href={getLocalizedPath("/calculadora-eliminacion", locale)}>{tt("navClearance")}</FooterLink>
              <FooterLink href={getLocalizedPath("/calculadora-costo-mg", locale)}>{tt("navCostPerMg")}</FooterLink>
              <FooterLink href={getLocalizedPath("/calculadora-trt", locale)}>{tt("navTrt")}</FooterLink>
              <FooterLink href={getLocalizedPath("/quiz-trt", locale)}>{tt("navTrtQuiz")}</FooterLink>
            </FooterColumn>

            <FooterColumn title={t("colCommunity")}>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/ideas">{tt("navIdeas")}</FooterLink>
              <FooterLink href={getLocalizedPath("/quienes-somos", locale)}>{tq("title")}</FooterLink>
            </FooterColumn>

            <FooterColumn title={t("colLegal")}>
              <FooterLink href={getLocalizedPath("/terminos", locale)}>{t("terms")}</FooterLink>
              <FooterLink href={getLocalizedPath("/privacidad", locale)}>{t("privacy")}</FooterLink>
              <FooterLink href="/cookies">{t("cookies")}</FooterLink>
              <FooterLink href={getLocalizedPath("/reembolsos", locale)}>{t("refunds")}</FooterLink>
              <FooterLink href={getLocalizedPath("/aviso-legal", locale)}>{t("legalEntity")}</FooterLink>
            </FooterColumn>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">{t("copyright", { year })}</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <ul className="mt-3 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
        {children}
      </Link>
    </li>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.82c-.9-.83-1.42-2.02-1.42-3.32h-3.06v14.06c0 1.44-1.17 2.62-2.62 2.62a2.62 2.62 0 0 1 0-5.25c.24 0 .48.03.7.1V10.9a5.9 5.9 0 0 0-.7-.04A5.69 5.69 0 0 0 4 16.55a5.69 5.69 0 0 0 9.68 4.08 5.66 5.66 0 0 0 1.71-4.08V9.4a8.6 8.6 0 0 0 5.02 1.6V8.94a5.28 5.28 0 0 1-3.81-3.12Z" />
    </svg>
  );
}
