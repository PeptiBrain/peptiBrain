"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resetMixpanel } from "@/lib/mixpanel";

export function SignOutButton() {
  const t = useTranslations("AppShell");
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    resetMixpanel();
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      aria-label={t("signOut")}
      className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
    >
      <LogOut className="size-4.5" aria-hidden />
    </button>
  );
}
