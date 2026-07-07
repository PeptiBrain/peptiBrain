import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShieldAlert } from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");

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
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("instagram")}
            className="text-muted-foreground hover:text-foreground"
          >
            <InstagramIcon className="size-5" aria-hidden />
          </a>
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
