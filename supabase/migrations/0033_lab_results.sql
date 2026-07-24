-- ============================================================================
-- PEPTIBRAIN — Análisis de sangre (labs) en contexto del protocolo
-- Una fila por marcador (ej. "Testosterona total") por fecha, para poder
-- mostrarlos junto a la línea de tiempo de qué se estaba tomando ese día.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  marker text not null,
  value numeric not null,
  unit text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists lab_results_user_date_idx on public.lab_results (user_id, log_date desc);

alter table public.lab_results enable row level security;

drop policy if exists "lab_results_own_select" on public.lab_results;
create policy "lab_results_own_select" on public.lab_results
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "lab_results_own_insert" on public.lab_results;
create policy "lab_results_own_insert" on public.lab_results
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "lab_results_own_delete" on public.lab_results;
create policy "lab_results_own_delete" on public.lab_results
  for delete to authenticated using (user_id = (select auth.uid()));
