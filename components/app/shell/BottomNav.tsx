"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, Package, HeartPulse, Users } from "lucide-react";

export function BottomNav() {
  const t = useTranslations("AppShell");
  const pathname = usePathname();

  const TABS = [
    { href: "/app", label: t("tabHome"), icon: Home },
    { href: "/app/peptidos", label: t("tabPeptides"), icon: Package },
    { href: "/app/salud", label: t("tabHealth"), icon: HeartPulse },
    { href: "/app/familia", label: t("tabFamily"), icon: Users },
  ];

  return (
    <nav
      aria-label={t("navLabel")}
      className="sticky bottom-0 z-20 flex h-16 border-t border-border bg-background/95 backdrop-blur"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
            aria-current={active ? "page" : undefined}
          >
            <span
              className={`flex size-8 items-center justify-center rounded-full ${
                active ? "bg-primary/15" : ""
              }`}
            >
              <tab.icon
                className={`size-5 ${active ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={active ? 2.5 : 2}
                aria-hidden
              />
            </span>
            <span
              className={`text-[11px] font-medium ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
