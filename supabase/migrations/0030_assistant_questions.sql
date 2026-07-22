-- Guarda las preguntas que la gente le hace al Asistente IA, para que el dueño
-- vea en el panel QUÉ duda tiene su audiencia (y decida qué contenido/features crear).
-- Solo se escribe desde el servidor (service_role, en el endpoint del asistente) y
-- solo el dueño (role='admin') puede leerlas — nunca queda expuesto a otros usuarios.
create table if not exists public.assistant_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  plan text,
  question text not null,
  created_at timestamptz not null default now()
);

create index if not exists assistant_questions_created_at_idx on public.assistant_questions (created_at desc);

alter table public.assistant_questions enable row level security;

-- Nadie inserta desde el cliente: la inserción va por el servidor con service_role
-- (que salta RLS). Aquí solo damos permiso de LECTURA al dueño.
create policy assistant_questions_admin_select on public.assistant_questions
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
