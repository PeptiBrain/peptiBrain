-- ============================================================================
-- PEPTIBRAIN — El advisor de rendimiento marcaba 8 tablas con dos políticas
-- RLS permisivas para el mismo rol+acción (propia + compartida vía familia),
-- lo que obliga a Postgres a evaluar ambas en cada consulta. Se fusionan en
-- una sola política con OR — mismo resultado exacto (mismas filas visibles),
-- una sola evaluación por consulta. Aplicado directo a producción vía
-- Supabase MCP el 2026-07-25.
-- ============================================================================

drop policy if exists "doses_select_own" on public.doses;
drop policy if exists "doses_select_shared" on public.doses;
create policy "doses_select_own_or_shared" on public.doses
  for select to public
  using (((select auth.uid()) = user_id) or private.has_shared_access(user_id));

drop policy if exists "health_logs_select_own" on public.health_logs;
drop policy if exists "health_logs_select_shared" on public.health_logs;
create policy "health_logs_select_own_or_shared" on public.health_logs
  for select to public
  using (((select auth.uid()) = user_id) or private.has_shared_access(user_id));

drop policy if exists "meals_select_own" on public.meals;
drop policy if exists "meals_select_shared" on public.meals;
create policy "meals_select_own_or_shared" on public.meals
  for select to public
  using (((select auth.uid()) = user_id) or private.has_shared_access(user_id));

drop policy if exists "peptides_select_own" on public.peptides;
drop policy if exists "peptides_select_shared" on public.peptides;
create policy "peptides_select_own_or_shared" on public.peptides
  for select to public
  using (((select auth.uid()) = user_id) or private.has_shared_access(user_id));

drop policy if exists "trips_select_own" on public.trips;
drop policy if exists "trips_select_shared" on public.trips;
create policy "trips_select_own_or_shared" on public.trips
  for select to public
  using (((select auth.uid()) = user_id) or private.has_shared_access(user_id));

drop policy if exists "vials_select_own" on public.vials;
drop policy if exists "vials_select_shared" on public.vials;
create policy "vials_select_own_or_shared" on public.vials
  for select to public
  using (((select auth.uid()) = user_id) or private.has_shared_access(user_id));

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_as_shared_owner" on public.profiles;
create policy "profiles_select_own_or_shared" on public.profiles
  for select to public
  using (((select auth.uid()) = id) or private.has_shared_access(id));

drop policy if exists "family_select_own" on public.family_members;
drop policy if exists "family_select_as_guest" on public.family_members;
create policy "family_select_own_or_guest" on public.family_members
  for select to public
  using (((select auth.uid()) = owner_id) or (lower(email) = lower(private.current_user_email())));

drop policy if exists "family_update_own" on public.family_members;
drop policy if exists "family_update_as_guest" on public.family_members;
create policy "family_update_own_or_guest" on public.family_members
  for update to public
  using (((select auth.uid()) = owner_id) or (lower(email) = lower(private.current_user_email())))
  with check (((select auth.uid()) = owner_id) or (lower(email) = lower(private.current_user_email())));
