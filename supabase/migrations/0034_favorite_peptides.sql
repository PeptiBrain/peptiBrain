-- ============================================================================
-- PEPTIBRAIN — Péptidos favoritos (Biblioteca)
-- Guarda qué péptidos de la Biblioteca marcó cada usuario con la estrella.
-- Referencia por nombre (los 48 péptidos de referencia son datos estáticos
-- del código, no filas en la base de datos).
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.favorite_peptides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  peptide_name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, peptide_name)
);

create index if not exists favorite_peptides_user_idx on public.favorite_peptides (user_id);

alter table public.favorite_peptides enable row level security;

drop policy if exists "favorite_peptides_own_select" on public.favorite_peptides;
create policy "favorite_peptides_own_select" on public.favorite_peptides
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "favorite_peptides_own_insert" on public.favorite_peptides;
create policy "favorite_peptides_own_insert" on public.favorite_peptides
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "favorite_peptides_own_delete" on public.favorite_peptides;
create policy "favorite_peptides_own_delete" on public.favorite_peptides
  for delete to authenticated using (user_id = (select auth.uid()));
