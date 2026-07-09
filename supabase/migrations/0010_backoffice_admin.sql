-- ============================================================================
-- PEPTIBRAIN — Backoffice: rol de administrador
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.profiles add column if not exists role text not null default 'user' check (role in ('user','admin'));

-- Marca al dueño como admin (ajusta el correo si algún día cambia).
update public.profiles set role = 'admin' where lower(email) = lower('josepovedaedinar@gmail.com');
