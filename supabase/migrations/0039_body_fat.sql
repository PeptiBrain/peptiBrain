-- ============================================================================
-- PEPTIBRAIN — % de grasa corporal (junto al peso, en el mismo registro diario)
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.health_logs
  add column if not exists body_fat_pct numeric check (body_fat_pct > 0 and body_fat_pct < 100);
