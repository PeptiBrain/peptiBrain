import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/app/shell/TopNav";
import { ThemeToggle } from "@/components/app/shell/ThemeToggle";
import { ProfileMenu } from "@/components/app/shell/ProfileMenu";
import { AppTour } from "@/components/app/shell/AppTour";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let name = "";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("name").eq("id", user.id).single();
    name = profile?.name ?? "";
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        role="banner"
        className="sticky top-0 z-20 flex h-[57px] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur"
      >
        <Link href="/app" className="flex items-center gap-2">
          <Image src="/peptibrain-isotipo.svg" alt="" width={26} height={26} />
          <span className="font-display text-base font-bold text-foreground">PeptiBrain</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <ProfileMenu name={name} />
        </div>
      </header>
      <TopNav />
      <main className="flex-1">{children}</main>
      <AppTour />
    </div>
  );
}
