-- El plan Family deja de ser "solo ver" y pasa a ser lo que ya promete el
-- Centro de Ayuda: hasta 3 cuentas COMPLETAS (cada quien con sus propios
-- péptidos/dosis, que ya funcionaba) con las funciones Premium regaladas por
-- quien paga. Esta columna recuerda de quién heredó el plan cada cuenta, para
-- poder devolverla a "free" si sale de la familia o si el dueño deja de pagar
-- (y para no tocar a alguien que YA pagaba su propio plan por su cuenta).
alter table public.profiles add column if not exists family_seat_owner_id uuid references public.profiles(id) on delete set null;

-- ============================================================================
-- ARREGLO DE SEGURIDAD (encontrado al construir esto, no relacionado directo):
-- "profiles_update_own" permitía a cualquier usuario logueado cambiar SU PROPIO
-- plan/plan_status/is_lifetime/role directamente (sin pasar por Hotmart ni por
-- el panel de admin), con las herramientas del navegador. Nunca se explotó que
-- sepamos, pero estaba abierto. Este trigger bloquea cambios a esas columnas
-- salvo que los haga el backend (service_role: webhook de Hotmart, rutas /api).
-- ============================================================================
create or replace function private.protect_profile_billing_fields() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.role() <> 'service_role' then
    new.plan := old.plan;
    new.plan_status := old.plan_status;
    new.is_lifetime := old.is_lifetime;
    new.family_seat_owner_id := old.family_seat_owner_id;
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_billing on public.profiles;
create trigger profiles_protect_billing
  before update on public.profiles
  for each row execute function private.protect_profile_billing_fields();
