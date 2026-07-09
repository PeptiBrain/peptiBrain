-- ============================================================================
-- PEPTIBRAIN — Fecha real de la dosis (para el Calendario)
-- Hasta ahora "cuándo" solo se guardaba como texto ("Sáb, 4 jul, 5:31 p.m."),
-- sin fecha real detrás. Eso rompía cualquier cálculo de fechas (por eso el
-- "hace -1 días" en Viales) y hacía imposible un calendario real.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.doses add column if not exists scheduled_at timestamptz;
update public.doses set scheduled_at = created_at where scheduled_at is null;
alter table public.doses alter column scheduled_at set not null;

create index if not exists doses_user_scheduled_idx on public.doses(user_id, scheduled_at);
