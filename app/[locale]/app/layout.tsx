import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CreditCard } from "lucide-react";
import { BottomNav } from "@/components/app/shell/BottomNav";
import { SignOutButton } from "@/components/app/shell/SignOutButton";
import { AppTour } from "@/components/app/shell/AppTour";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header
        role="banner"
        className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur"
      >
        <Link href="/app" className="flex items-center gap-2">
          <Image src="/peptibrain-isotipo.svg" alt="" width={26} height={26} />
          <span className="font-display text-base font-bold text-foreground">PeptiBrain</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/app/cuenta"
            aria-label="Mi cuenta"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <CreditCard className="size-4.5" aria-hidden />
          </Link>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <BottomNav />
      <AppTour />
    </div>
  );
}
