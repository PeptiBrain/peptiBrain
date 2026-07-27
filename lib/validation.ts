// Validaciones compartidas de formato (no de plausibilidad clínica — ver
// lib/plausible.ts para eso). "Editar perfil" ya validaba email/teléfono
// correctamente; Proveedores y el teléfono de un familiar no lo hacían
// (bug #22 y #77 del QA: `javascript:alert(1)` como web, `abcdefg` como
// teléfono, se guardaban sin aviso).

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidPhoneDigits(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

// Solo http(s) — bloquea "javascript:alert(1)" y similares sin discutir con
// el usuario un formato exacto de URL.
export function isValidWebsite(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  try {
    const url = new URL(v.match(/^https?:\/\//) ? v : `https://${v}`);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
