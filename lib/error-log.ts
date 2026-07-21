import { createClient } from "@/lib/supabase/client";

// Manda el error a error_log (RLS: el cliente solo puede insertar, nunca leer) para
// que aparezca en la sección "Salud" del panel de admin. Se traga cualquier fallo del
// propio log (nunca debe romper la pantalla de error que ya estamos mostrando).
export async function logError(error: Error, context: string) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("error_log").insert({
      message: error.message.slice(0, 500),
      context,
      user_id: user?.id ?? null,
    });
  } catch {
    // silencioso a propósito
  }
}
