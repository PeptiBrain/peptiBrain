-- ============================================================================
-- PEPTIBRAIN — Asistente IA: control de uso diario (circuit-breaker de costo)
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.assistant_usage (
  user_id      uuid not null references auth.users(id) on delete cascade,
  usage_date   date not null default current_date,
  message_count integer not null default 0,
  primary key (user_id, usage_date)
);
alter table public.assistant_usage enable row level security;

create policy "assistant_usage_select_own" on public.assistant_usage for select
  using (user_id = (select auth.uid()));
