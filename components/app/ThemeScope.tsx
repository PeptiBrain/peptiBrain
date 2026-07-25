"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { applyTheme, getStoredPref, resolvePref } from "@/lib/theme";

// El modo oscuro es una preferencia SOLO de la app logueada (se elige en
// ProfileMenu/ThemeToggle, ninguno de los dos existe en la web pública).
// Sin este control, la clase `dark` en <html> quedaba pegada al navegar de
// vuelta a la landing/blog/paywall vía navegación de cliente (sin recarga),
// y la web de marketing —diseñada y probada solo en claro— se veía oscura.
export function ThemeScope() {
  const pathname = usePathname();

  useEffect(() => {
    const inApp = pathname === "/app" || pathname.startsWith("/app/");
    applyTheme(inApp ? resolvePref(getStoredPref()) : "light");
  }, [pathname]);

  return null;
}
