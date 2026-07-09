"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Bell, Check } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  loadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "@/lib/notifications";

export function NotificationBell() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications().then(setItems);
    const id = setInterval(() => loadNotifications().then(setItems), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const unread = (items || []).filter((n) => !n.readAt).length;

  async function handleClick(n: Notification) {
    if (!n.readAt) {
      await markNotificationRead(n.id);
      setItems((prev) => (prev || []).map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)));
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    setItems((prev) => (prev || []).map((x) => ({ ...x, readAt: x.readAt || new Date().toISOString() })));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("title")}
        aria-expanded={open}
        className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Bell className="size-4.5" aria-hidden />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex size-2 rounded-full bg-destructive ring-2 ring-background" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">{t("title")}</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Check className="size-3.5" aria-hidden /> {t("markAllRead")}
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {items === null ? (
              <p className="p-4 text-sm text-muted-foreground">{t("loading")}</p>
            ) : items.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">{t("empty")}</p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleClick(n)}
                      className={`flex w-full items-start gap-2 px-4 py-3 text-left hover:bg-secondary ${
                        n.readAt ? "" : "bg-accent/40"
                      }`}
                    >
                      <span
                        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.readAt ? "bg-transparent" : "bg-primary"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{n.title}</span>
                        <span className="block text-xs text-muted-foreground">{n.body}</span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString(locale, {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
