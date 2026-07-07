"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

// Site Key pública de Cloudflare Turnstile — segura de exponer en el navegador.
// Si no está configurada (dev local sin .env), cae a la clave de prueba oficial de Cloudflare.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

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
        sitekey: SITE_KEY,
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
