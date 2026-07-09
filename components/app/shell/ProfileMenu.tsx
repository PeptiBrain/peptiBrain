"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  ChevronDown,
  Monitor,
  Sun,
  Moon,
  Pencil,
  Users,
  FileText,
  Compass,
  LifeBuoy,
  LogOut,
  Bell,
  Plane,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resetMixpanel } from "@/lib/mixpanel";
import { getStoredPref, setThemePref, type ThemePref } from "@/lib/theme";
import { RESTART_EVENT } from "@/components/app/shell/AppTour";
import { HelpCenter } from "@/components/app/shell/HelpCenter";

export function ProfileMenu({
  name,
  email,
  plan,
}: {
  name: string;
  email: string;
  plan: "free" | "premium" | "family";
}) {
  const t = useTranslations("AppShell");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [pref, setPref] = useState<ThemePref>("system");
  const ref = useRef<HTMLDivElement>(null);
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const isPremium = plan !== "free";

  useEffect(() => setPref(getStoredPref()), []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function pickTheme(p: ThemePref) {
    setPref(p);
    setThemePref(p);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    resetMixpanel();
    router.push("/login");
  }

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  function restartTour() {
    setOpen(false);
    router.push("/app");
    setTimeout(() => window.dispatchEvent(new Event(RESTART_EVENT)), 300);
  }

  const THEME_OPTIONS: { key: ThemePref; label: string; icon: typeof Monitor }[] = [
    { key: "system", label: t("themeSystem"), icon: Monitor },
    { key: "light", label: t("themeLight"), icon: Sun },
    { key: "dark", label: t("themeDark"), icon: Moon },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("profileMenu")}
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-2 pr-3 text-sm font-medium text-foreground hover:bg-secondary"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {initial}
        </span>
        <span className="max-w-[8rem] truncate">{name || t("profileMenu")}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          {/* Cabecera */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base font-semibold text-primary">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{name || "—"}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          {/* Tema */}
          <div className="border-b border-border p-3">
            <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">{t("theme")}</p>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
              {THEME_OPTIONS.map((o) => {
                const active = pref === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => pickTheme(o.key)}
                    className={`flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                      active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <o.icon className="size-4" aria-hidden />
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acciones */}
          <div className="p-1.5">
            <MenuItem icon={Pencil} label={t("editProfile")} onClick={() => go("/app/cuenta")} />
            <MenuItem icon={Users} label={t("shareProgress")} onClick={() => go("/app/familia")} />
            <MenuItem
              icon={FileText}
              label={t("downloadReport")}
              onClick={() => {
                setOpen(false);
                window.print();
              }}
            />
            <MenuItem icon={Compass} label={t("guidedTour")} onClick={restartTour} />
            <MenuItem
              icon={LifeBuoy}
              label={t("helpCenter")}
              onClick={() => {
                setOpen(false);
                setShowHelp(true);
              }}
            />

            {/* Próximamente (honesto: aún no construidas) */}
            <ComingSoonItem icon={Bell} label={t("reminders")} tag={t("soon")} />
            <ComingSoonItem icon={Plane} label={t("travelMode")} tag={t("soon")} />

            <div className="my-1 border-t border-border" />
            <MenuItem icon={LogOut} label={t("signOut")} onClick={handleSignOut} destructive />
          </div>

          {!isPremium && (
            <button
              type="button"
              onClick={() => go("/paywall")}
              className="flex w-full items-center justify-center gap-1.5 border-t border-border bg-accent px-4 py-3 text-sm font-semibold text-primary"
            >
              <Lock className="size-3.5" aria-hidden /> {t("upgradeCta")}
            </button>
          )}
        </div>
      )}

      <HelpCenter open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary ${
        destructive ? "text-destructive" : "text-foreground"
      }`}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </button>
  );
}

function ComingSoonItem({ icon: Icon, label, tag }: { icon: typeof Bell; label: string; tag: string }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium text-muted-foreground">
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
      <span className="ml-auto shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
        {tag}
      </span>
    </div>
  );
}
