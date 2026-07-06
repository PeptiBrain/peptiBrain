"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanel, trackPageview } from "@/lib/mixpanel";

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  return <>{children}</>;
}
