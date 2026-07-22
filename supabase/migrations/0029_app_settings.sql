-- Ajustes de la app editables desde el panel del dueño (ej. el ID de Google
-- Analytics). No guarda secretos — solo configuración pública tipo "G-XXXX", que
-- de todas formas aparece en el HTML de la web. Lectura pública (la web necesita
-- el ID para cargar el script); escritura solo desde el backend (service_role, vía
-- el endpoint de admin protegido).
create table if not exists public.app_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

-- Cualquiera puede LEER la config no sensible (necesario para cargar GA en la web).
create policy app_settings_public_read on public.app_settings
  for select using (true);
-- Sin política de insert/update para clientes → solo el service_role (backend) escribe.
