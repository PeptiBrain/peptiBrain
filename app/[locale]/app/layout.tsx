import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BottomNav } from "@/components/app/shell/BottomNav";
import { SignOutButton } from "@/components/app/shell/SignOutButton";

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
        <SignOutButton />
      </header>
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
