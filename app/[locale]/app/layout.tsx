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
import { DoseCelebrationToast } from "@/components/app/shell/DoseCelebrationToast";
import { FirstRecordToast } from "@/components/app/shell/FirstRecordToast";
import { MilestoneModal } from "@/components/app/shell/MilestoneModal";
import { SatisfactionSurveyModal } from "@/components/app/shell/SatisfactionSurveyModal";
import { isSatisfactionSurveyEligible } from "@/lib/satisfaction-survey";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let name = "";
  let email = "";
  let plan: "free" | "premium" | "family" = "free";
  let remindersEnabled = false;
  let trips: { startDate: string; endDate: string }[] = [];
  let satisfactionSurveyEligible = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email, plan, reminders_enabled, created_at, last_satisfaction_survey_shown_at")
      .eq("id", user.id)
      .single();
    name = profile?.name ?? "";
    email = profile?.email ?? user.email ?? "";
    plan = (profile?.plan as "free" | "premium" | "family") ?? "free";
    remindersEnabled = profile?.reminders_enabled ?? false;
    satisfactionSurveyEligible = isSatisfactionSurveyEligible(
      profile?.created_at ?? null,
      profile?.last_satisfaction_survey_shown_at ?? null
    );

    // El servidor no sabe la zona horaria del usuario — comparar "hoy" (UTC)
    // contra start_date/end_date apagaba el badge de Modo viaje varias horas
    // antes de lo esperado para quien vive al oeste de UTC. Se trae la lista
    // completa (tabla pequeña) y el cliente decide con SU fecha local.
    const { data: tripRows } = await supabase
      .from("trips")
      .select("start_date, end_date")
      .eq("user_id", user.id);
    trips = (tripRows || []).map((t) => ({ startDate: t.start_date, endDate: t.end_date }));
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        role="banner"
        className="sticky top-0 z-20 flex h-[57px] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur print:hidden"
      >
        {/* min-w-0 + truncate: a 372px los 4 controles de la derecha no dejaban
            sitio y el logo se solapaba con el de sincronizar (bug #71). Ahora el
            que cede es el texto de la marca, no los botones. */}
        <Link href="/app" className="flex min-w-0 items-center gap-2">
          <Image src="/peptibrain-isotipo.svg" alt="" width={26} height={26} className="shrink-0" />
          <span className="truncate font-display text-base font-bold text-foreground">PeptiBrain</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <RefreshButton />
          <NotificationBell />
          <ThemeToggle />
          <ProfileMenu
            name={name}
            email={email}
            plan={plan}
            remindersEnabled={remindersEnabled}
            trips={trips}
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
        <DoseCelebrationToast />
        <FirstRecordToast />
        <MilestoneModal />
        <SatisfactionSurveyModal eligible={satisfactionSurveyEligible} />
      </div>
    </div>
  );
}
