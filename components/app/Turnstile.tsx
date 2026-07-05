"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

// Clave de PRUEBA oficial de Cloudflare (siempre pasa, visible). En la Sesión 6 se
// reemplaza por la clave real del sitio (Cloudflare Turnstile → tu cuenta).
const TEST_SITE_KEY = "1x00000000000000000000AA";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: { sitekey: string; callback?: (token: string) => void; theme?: string }
  ) => string;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function Turnstile({ onVerify }: { onVerify?: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    function tryRender() {
      if (rendered.current || !window.turnstile || !ref.current) return;
      rendered.current = true;
      window.turnstile.render(ref.current, {
        sitekey: TEST_SITE_KEY,
        theme: "light",
        callback: (token: string) => onVerify?.(token),
      });
    }
    tryRender();
    const id = setInterval(tryRender, 300);
    return () => clearInterval(id);
  }, [onVerify]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div ref={ref} className="min-h-[100px] overflow-visible" />
    </>
  );
}
