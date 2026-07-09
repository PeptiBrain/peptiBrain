-- ============================================================================
-- PEPTIBRAIN — Asistente IA: tope global diario (kill-switch de gasto)
-- Sin esto, el límite de 20 mensajes/día es SOLO por persona — si tuvieras
-- muchos usuarios Premium usándolo a full, no hay nada que pare el gasto total.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.assistant_global_usage (
  usage_date     date primary key default current_date,
  message_count  integer not null default 0,
  alert_sent     boolean not null default false
);
alter table public.assistant_global_usage enable row level security;
-- Sin políticas -> solo el service role (servidor) puede leer/escribir esta tabla.
