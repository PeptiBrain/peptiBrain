-- Registro de errores para la sección "Salud" del panel de admin — antes no existía
-- ningún Error Boundary en la app, así que esta tabla también es la primera vez que
-- capturamos errores reales en producción (no solo en la consola del navegador).
create table if not exists public.error_log (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  context text not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists error_log_created_at_idx on public.error_log (created_at desc);

alter table public.error_log enable row level security;

-- El cliente SOLO inserta, y solo con su propio user_id (o null si no hay sesión) —
-- nunca lee ni edita errores ajenos.
create policy error_log_insert_own on public.error_log
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy error_log_insert_anon on public.error_log
  for insert to anon
  with check (user_id is null);

-- Solo el dueño (role='admin') puede leer el historial de errores.
create policy error_log_admin_select on public.error_log
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
