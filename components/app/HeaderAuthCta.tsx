"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

// La sesión se lee en el NAVEGADOR, no en el servidor.
// Antes el Header hacía `await supabase.auth.getUser()` en servidor, lo que
// obligaba a Next a renderizar TODA la web pública en cada visita (leer
// cookies = ruta dinámica) — ~739 ms de espera antes de dibujar nada, y sin
// posibilidad de cachear la landing. Moviéndolo aquí, la landing/blog/
// calculadoras vuelven a ser estáticas y el botón se ajusta al instante
// después, sin bloquear la carga.
export function HeaderAuthCta({
  loginLabel,
  ctaLabel,
  goToAppLabel,
}: {
  loginLabel: string;
  ctaLabel: string;
  goToAppLabel: string;
}) {
  // null = todavía no sabemos. Se asume "sin sesión" al pintar, que es el caso
  // del 99% de las visitas a la web pública (visitantes nuevos).
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (alive) setSignedIn(!!data.user);
      })
      .catch(() => {
        if (alive) setSignedIn(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // min-w fija para que el cambio de "Empezar gratis" a "Ir a mi app" no
  // desplace el resto del header (CLS = 0).
  const btn =
    "inline-flex h-11 min-w-[7.25rem] items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-97 sm:px-4";

  if (signedIn) {
    return (
      <Link href="/app" className={btn}>
        {goToAppLabel}
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
      >
        {loginLabel}
      </Link>
      <Link href="/login" className={btn}>
        {ctaLabel}
      </Link>
    </>
  );
}
