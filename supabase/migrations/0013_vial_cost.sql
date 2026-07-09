-- ============================================================================
-- PEPTIBRAIN — Coste del vial (para el control de finanzas del usuario)
-- Permite registrar cuánto pagó el usuario por cada vial y así calcular el
-- dinero invertido en péptidos, gasto por mes y coste por dosis.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.vials add column if not exists cost numeric;
