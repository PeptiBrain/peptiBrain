"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { CreditCard, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { resetMixpanel } from "@/lib/mixpanel";

export function ProfileMenu({ name }: { name: string }) {
  const t = useTranslations("AppShell");
  const router = useRouter();
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    resetMixpanel();
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-2 pr-3 text-sm font-medium text-foreground hover:bg-secondary"
        aria-label={t("profileMenu")}
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {initial}
        </span>
        <span className="max-w-[8rem] truncate">{name}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          render={
            <Link href="/app/cuenta" className="flex items-center gap-2">
              <CreditCard className="size-4" aria-hidden />
              {t("myAccount")}
            </Link>
          }
        />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut} className="flex items-center gap-2">
          <LogOut className="size-4" aria-hidden />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
