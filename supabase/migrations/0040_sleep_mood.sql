-- ============================================================================
-- PEPTIBRAIN — Sueño y estado de ánimo (junto a peso/hidratación/efectos)
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.health_logs
  add column if not exists sleep_hours numeric check (sleep_hours >= 0 and sleep_hours <= 24),
  add column if not exists mood smallint check (mood between 1 and 5);
