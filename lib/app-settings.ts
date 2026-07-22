// Lee un ajuste público de la app (ej. el ID de Google Analytics) para el layout
// raíz. IMPORTANTE: usa un fetch directo a la API REST de Supabase con la anon key
// (NO el cliente con cookies), y con caché de 5 min. Así la landing y demás páginas
// siguen siendo estáticas/ISR — leer cookies o sin caché las volvería dinámicas y
// mataría el rendimiento. Devuelve null si no está configurado o la tabla no existe.
export async function getPublicSetting(key: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/app_settings?key=eq.${encodeURIComponent(key)}&select=value`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        next: { revalidate: 300, tags: ["app-settings"] },
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { value?: string }[];
    const v = rows?.[0]?.value?.trim();
    return v ? v : null;
  } catch {
    return null;
  }
}

// Valida el formato de un ID de medición de Google Analytics 4 (G-XXXXXXXXXX).
export function isValidGaId(value: string): boolean {
  return /^G-[A-Z0-9]{6,}$/i.test(value.trim());
}
