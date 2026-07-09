import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/app/shell/TopNav";
import { ProfileMenu } from "@/components/app/shell/ProfileMenu";
import { ThemeToggle } from "@/components/app/shell/ThemeToggle";
import { RefreshButton } from "@/components/app/shell/RefreshButton";
import { AppTour } from "@/components/app/shell/AppTour";
import { NextDosesWidget } from "@/components/app/shell/NextDosesWidget";
import { NotificationBell } from "@/components/app/shell/NotificationBell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let name = "";
  let email = "";
  let plan: "free" | "premium" | "family" = "free";
  let remindersEnabled = false;
  let travelModeActive = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email, plan, reminders_enabled")
      .eq("id", user.id)
      .single();
    name = profile?.name ?? "";
    email = profile?.email ?? user.email ?? "";
    plan = (profile?.plan as "free" | "premium" | "family") ?? "free";
    remindersEnabled = profile?.reminders_enabled ?? false;

    const today = new Date().toISOString().slice(0, 10);
    const { data: activeTrip } = await supabase
      .from("trips")
      .select("id")
      .eq("user_id", user.id)
      .lte("start_date", today)
      .gte("end_date", today)
      .limit(1)
      .maybeSingle();
    travelModeActive = !!activeTrip;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        role="banner"
        className="sticky top-0 z-20 flex h-[57px] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur print:hidden"
      >
        <Link href="/app" className="flex items-center gap-2">
          <Image src="/peptibrain-isotipo.svg" alt="" width={26} height={26} />
          <span className="font-display text-base font-bold text-foreground">PeptiBrain</span>
        </Link>
        <div className="flex items-center gap-1">
          <RefreshButton />
          <NotificationBell />
          <ThemeToggle />
          <ProfileMenu
            name={name}
            email={email}
            plan={plan}
            remindersEnabled={remindersEnabled}
            travelModeActive={travelModeActive}
          />
        </div>
      </header>
      <div className="print:hidden">
        <TopNav />
      </div>
      <main className="flex-1">{children}</main>
      <div className="print:hidden">
        <AppTour />
        <NextDosesWidget />
      </div>
    </div>
  );
}
