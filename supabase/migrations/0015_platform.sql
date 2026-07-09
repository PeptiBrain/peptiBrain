-- ============================================================================
-- PEPTIBRAIN — Dispositivo del usuario (iOS / Android / Escritorio)
-- Para el panel de control: saber desde qué dispositivo se registró cada
-- usuario y ver el reparto (como el iOS/Android del dashboard de referencia).
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.profiles add column if not exists platform text;
