import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShieldAlert } from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");
  const tt = useTranslations("Tools");

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

      <footer role="contentinfo" className="border-t border-border px-4 py-6">
        <nav
          aria-label={tt("moreTools")}
          className="mx-auto mb-5 flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm font-medium text-muted-foreground"
        >
          <Link href="/calculadora" className="hover:text-foreground hover:underline">
            {tt("navCalculator")}
          </Link>
          <Link href="/calculadora-semaglutida" className="hover:text-foreground hover:underline">
            {tt("navSemaglutide")}
          </Link>
          <Link href="/comparador" className="hover:text-foreground hover:underline">
            {tt("navComparador")}
          </Link>
          <Link href="/protocolos" className="hover:text-foreground hover:underline">
            {tt("navProtocols")}
          </Link>
          <Link href="/blog" className="hover:text-foreground hover:underline">
            Blog
          </Link>
        </nav>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/peptibrain-isotipo.svg" alt="" width={22} height={22} />
            <span className="font-display text-sm font-bold text-foreground">PeptiBrain</span>
          </Link>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm text-muted-foreground"
          >
            <Link href="/terminos" className="hover:text-foreground hover:underline">
              {t("terms")}
            </Link>
            <Link href="/privacidad" className="hover:text-foreground hover:underline">
              {t("privacy")}
            </Link>
            <Link href="/cookies" className="hover:text-foreground hover:underline">
              {t("cookies")}
            </Link>
            <Link href="/reembolsos" className="hover:text-foreground hover:underline">
              {t("refunds")}
            </Link>
            <Link href="/aviso-legal" className="hover:text-foreground hover:underline">
              {t("legalEntity")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/peptibrain/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("instagram")}
              className="text-muted-foreground hover:text-foreground"
            >
              <InstagramIcon className="size-5" aria-hidden />
            </a>
            <a
              href="https://www.tiktok.com/@peptibrainapp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("tiktok")}
              className="text-muted-foreground hover:text-foreground"
            >
              <TikTokIcon className="size-5" aria-hidden />
            </a>
          </div>
        </div>
      </footer>
    </>
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
