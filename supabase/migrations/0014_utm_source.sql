-- ============================================================================
-- PEPTIBRAIN — Origen del tráfico (marketing / atribución)
-- Guarda de dónde vino cada usuario (utm_source: instagram, tiktok, etc.)
-- para que el backoffice muestre qué canal trae más registros y ventas.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.profiles add column if not exists utm_source text;
