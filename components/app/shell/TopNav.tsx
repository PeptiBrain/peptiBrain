"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, Package, HeartPulse, Users } from "lucide-react";

export function TopNav() {
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
      className="sticky top-[57px] z-10 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-4 py-2 backdrop-blur"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <tab.icon className="size-4" strokeWidth={active ? 2.5 : 2} aria-hidden />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
