import { createClient } from "@/lib/supabase/server";

/**
 * Verifica en el SERVIDOR que quien pide la página/endpoint es el dueño (role='admin').
 * Devuelve el user si es admin, o null si no lo es o no hay sesión — nunca confiar
 * en ocultar el link del panel, eso es un IDOR (ver 09-SEGURIDAD.md).
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;

  return user;
}
