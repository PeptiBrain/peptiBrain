-- ============================================================================
-- PEPTIBRAIN — Último contacto + "¿Cómo nos conociste?"
--
-- `profiles.utm_source` ya guardaba el PRIMER contacto (nunca se sobrescribe,
-- por diseño de captureUtm() en lib/utm.ts) — pero solo eso: no había forma de
-- saber qué campaña cerró de verdad la venta si el usuario tocó varios canales
-- antes de registrarse. Se añade una columna separada para el último contacto.
--
-- También se añade una respuesta auto-reportada al registro ("¿Cómo nos
-- conociste?"), que existe para cubrir el tráfico oscuro: gente que ve un
-- vídeo de TikTok/Instagram y no hace clic en ningún enlace, sino que busca la
-- app días después — ese origen real no lo captura ningún UTM ni referrer.
--
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

alter table public.profiles add column if not exists utm_source_last text;
alter table public.profiles add column if not exists how_found text;
