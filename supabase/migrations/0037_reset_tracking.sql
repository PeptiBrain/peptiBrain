-- ============================================================================
-- PEPTIBRAIN — Restablecer datos de seguimiento ("Zona de peligro" en Cuenta)
-- Solo pone en cero las estadísticas de user_progress (racha, PB, congeladores)
-- — el resto de las tablas (péptidos, viales, dosis, salud, fotos, análisis,
-- favoritos) se borran directo desde el cliente porque ya tienen su propia
-- política RLS de "delete: own row". user_progress NO tiene política de
-- delete/update para el cliente (solo select) — por eso necesita esta función.
-- NO toca profiles (plan/suscripción) ni family_members (grupo familiar).
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create or replace function public.reset_tracking_progress()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.user_progress
  set pb_total = 0,
      current_streak = 0,
      longest_streak = 0,
      freezes = 0,
      last_active_on = null,
      updated_at = now()
  where user_id = auth.uid();
end;
$$;

grant execute on function public.reset_tracking_progress() to authenticated;
