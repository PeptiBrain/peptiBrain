-- ============================================================================
-- PEPTIBRAIN — Familia: nombre del dueño visible para el invitado antes de aceptar
-- (las políticas de 0003 solo dejan ver el perfil del dueño DESPUÉS de aceptar,
-- pero el invitado necesita saber quién lo invitó para decidir si acepta).
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.family_members add column if not exists owner_name text;
