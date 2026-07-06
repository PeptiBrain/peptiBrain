import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con la service_role key — SALTA row level security.
 * Usar SOLO en código de servidor de confianza (Route Handlers/webhooks),
 * NUNCA importar desde un componente de cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
