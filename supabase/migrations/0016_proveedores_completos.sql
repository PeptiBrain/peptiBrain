-- ============================================================================
-- PEPTIBRAIN — Proveedores completos (web, red social, teléfono, email, marcas)
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.providers add column if not exists website text;
alter table public.providers add column if not exists social_network text;
alter table public.providers add column if not exists social_handle text;
alter table public.providers add column if not exists phone text;
alter table public.providers add column if not exists email text;
alter table public.providers add column if not exists brands text[] not null default '{}';
