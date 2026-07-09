-- ============================================================================
-- PEPTIBRAIN — Sección Salud completa: Comidas (calorías) + notas de peso
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

-- 1. Notas opcionales al registrar el peso (paridad con PeptiBuddy)
alter table public.health_logs add column if not exists notes text;

-- 2. Comidas: a diferencia de peso/hidratación/ejercicio (un registro por día),
--    puede haber varias comidas el mismo día, así que va en su propia tabla.
create table if not exists public.meals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  log_date    date not null,
  description text not null check (length(description) between 1 and 200),
  calories    integer check (calories >= 0),
  created_at  timestamptz not null default now()
);
create index if not exists meals_user_date_idx on public.meals(user_id, log_date desc);
alter table public.meals enable row level security;

create policy "meals_select_own" on public.meals for select
  using (user_id = (select auth.uid()));
create policy "meals_insert_own" on public.meals for insert
  with check (user_id = (select auth.uid()));
create policy "meals_update_own" on public.meals for update
  using (user_id = (select auth.uid()));
create policy "meals_delete_own" on public.meals for delete
  using (user_id = (select auth.uid()));

-- Lectura compartida con Familia (mismo patrón que peptides/vials/doses/health_logs)
create policy "meals_select_shared" on public.meals for select
  using (
    exists (
      select 1 from public.family_members fm
      join public.profiles p on lower(p.email) = lower(fm.email)
      where fm.owner_id = meals.user_id
        and p.id = (select auth.uid())
        and fm.invite_status = 'accepted'
    )
  );
