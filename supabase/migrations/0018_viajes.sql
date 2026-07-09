-- ============================================================================
-- PEPTIBRAIN — Viajes (para el calendario: Péptidos · Viajes · Ejercicio)
-- Permite marcar días de viaje y verlos en el calendario junto a las dosis.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.trips (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  start_date  date not null,
  end_date    date not null,
  destination text,
  created_at  timestamptz not null default now()
);
create index if not exists trips_user_idx on public.trips(user_id, start_date);
alter table public.trips enable row level security;

create policy "trips_select_own" on public.trips for select
  using (user_id = (select auth.uid()));
create policy "trips_insert_own" on public.trips for insert
  with check (user_id = (select auth.uid()));
create policy "trips_delete_own" on public.trips for delete
  using (user_id = (select auth.uid()));

-- Lectura compartida con Familia (mismo patrón que el resto)
create policy "trips_select_shared" on public.trips for select
  using (private.has_shared_access(trips.user_id));
