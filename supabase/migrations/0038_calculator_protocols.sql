-- ============================================================================
-- PEPTIBRAIN — Protocolos guardados de la Calculadora (Premium)
-- Cálculos de reconstitución (uno o varios péptidos mezclados en el mismo
-- vial) que el usuario nombra y guarda para reusar, en vez de re-tipear cada
-- vez. Sincronizado a la cuenta (no solo localStorage) porque el usuario ya
-- tiene cuenta para llegar a la calculadora Premium.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.calculator_protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(name) between 1 and 60),
  notes text check (notes is null or length(notes) <= 500),
  vial_amount numeric not null check (vial_amount > 0),
  vial_unit text not null,
  bac_water numeric not null check (bac_water > 0),
  syringe_type text not null default 'u100',
  entries jsonb not null, -- [{peptideName, doseAmount, doseUnit}, ...] — 1+ péptidos sobre el mismo vial
  created_at timestamptz not null default now()
);

create index if not exists calculator_protocols_user_idx on public.calculator_protocols (user_id, created_at desc);

alter table public.calculator_protocols enable row level security;

drop policy if exists "calculator_protocols_own_select" on public.calculator_protocols;
create policy "calculator_protocols_own_select" on public.calculator_protocols
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "calculator_protocols_own_insert" on public.calculator_protocols;
create policy "calculator_protocols_own_insert" on public.calculator_protocols
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "calculator_protocols_own_delete" on public.calculator_protocols;
create policy "calculator_protocols_own_delete" on public.calculator_protocols
  for delete to authenticated using (user_id = (select auth.uid()));
