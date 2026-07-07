"use client";

import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";

export type SubTabItem = {
  key: string;
  label: string;
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
