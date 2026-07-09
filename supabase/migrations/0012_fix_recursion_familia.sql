-- ============================================================================
-- PEPTIBRAIN — FIX CRÍTICO: recursión infinita en políticas de Familia
-- Las políticas "profiles_select_as_shared_owner" y "family_select_as_guest"
-- se consultan entre sí (profiles -> family_members -> profiles -> ...),
-- lo que Postgres detecta como recursión infinita (error 42P17) y rompe
-- TODAS las consultas de péptidos/viales/dosis/salud/comidas/perfiles para
-- cualquier usuario logueado.
--
-- Solución estándar: dos funciones SECURITY DEFINER (dueño = postgres, que
-- no está sujeto a RLS) que resuelven el email/acceso compartido SIN volver
-- a evaluar las políticas de profiles/family_members, rompiendo el ciclo.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create or replace function private.current_user_email() returns text
language sql stable security definer set search_path = '' as $$
  select email from public.profiles where id = auth.uid();
$$;

create or replace function private.has_shared_access(p_owner_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.family_members fm
    where fm.owner_id = p_owner_id
      and lower(fm.email) = lower(private.current_user_email())
      and fm.invite_status = 'accepted'
  );
$$;

-- family_members: el invitado ve/acepta su propia invitación por email,
-- sin volver a consultar profiles a través de una política (rompe el ciclo).
drop policy if exists "family_select_as_guest" on public.family_members;
create policy "family_select_as_guest" on public.family_members for select
  using (lower(email) = lower(private.current_user_email()));

drop policy if exists "family_update_as_guest" on public.family_members;
create policy "family_update_as_guest" on public.family_members for update
  using (lower(email) = lower(private.current_user_email()))
  with check (lower(email) = lower(private.current_user_email()));

-- profiles: ver el nombre del dueño que te compartió sus datos.
drop policy if exists "profiles_select_as_shared_owner" on public.profiles;
create policy "profiles_select_as_shared_owner" on public.profiles for select
  using (private.has_shared_access(profiles.id));

-- peptides/vials/doses/health_logs/meals: lectura compartida, ya sin recursión.
drop policy if exists "peptides_select_shared" on public.peptides;
create policy "peptides_select_shared" on public.peptides for select
  using (private.has_shared_access(peptides.user_id));

drop policy if exists "vials_select_shared" on public.vials;
create policy "vials_select_shared" on public.vials for select
  using (private.has_shared_access(vials.user_id));

drop policy if exists "doses_select_shared" on public.doses;
create policy "doses_select_shared" on public.doses for select
  using (private.has_shared_access(doses.user_id));

drop policy if exists "health_logs_select_shared" on public.health_logs;
create policy "health_logs_select_shared" on public.health_logs for select
  using (private.has_shared_access(health_logs.user_id));

drop policy if exists "meals_select_shared" on public.meals;
create policy "meals_select_shared" on public.meals for select
  using (private.has_shared_access(meals.user_id));
