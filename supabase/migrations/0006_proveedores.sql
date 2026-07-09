-- ============================================================================
-- PEPTIBRAIN — Proveedores (paridad con PeptiBuddy, sección de Viales)
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.providers (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null check (length(name) between 1 and 120),
  notes      text,
  created_at timestamptz not null default now()
);
create index if not exists providers_user_idx on public.providers(user_id);
alter table public.providers enable row level security;

create policy "providers_select_own" on public.providers for select
  using (user_id = (select auth.uid()));
create policy "providers_insert_own" on public.providers for insert
  with check (user_id = (select auth.uid()));
create policy "providers_delete_own" on public.providers for delete
  using (user_id = (select auth.uid()));
