-- ============================================================================
-- PEPTIBRAIN — Check-in rápido de hambre/apetito (junto al registro de peso)
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.health_logs
  add column if not exists hunger smallint check (hunger between 1 and 5);
