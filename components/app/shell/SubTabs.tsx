"use client";

import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";

export type SubTabItem = {
  key: string;
  label: string;
  subtitle?: string;
  icon: LucideIcon;
  locked?: boolean;
};

export function SubTabs({
  items,
  value,
  onChange,
}: {
  items: SubTabItem[];
  value: string;
  onChange: (key: string) => void;
}) {
  const hasSubtitles = items.some((item) => item.subtitle);

  if (!hasSubtitles) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const active = value === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
              {item.locked && <Lock className="size-3.5 text-muted-foreground" aria-hidden />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors ${
              active
                ? "border-primary bg-accent"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <div
                className={`flex size-9 items-center justify-center rounded-lg ${
                  active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                <item.icon className="size-4.5" aria-hidden />
              </div>
              {item.locked && <Lock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />}
            </div>
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold ${
                  active ? "text-accent-foreground" : "text-foreground"
                }`}
              >
                {item.label}
              </p>
              {item.subtitle && (
                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{item.subtitle}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
