-- ============================================================================
-- PEPTIBRAIN — Encuesta de satisfacción (pop-up de 5 emojis, escala 1-5)
--
-- Mide qué tan feliz está el usuario con la app directamente dentro de la app
-- (PeptiBrain no se distribuye por App Store/Play Store, así que no hay
-- reviews de tienda que capturen esta señal). Se muestra a partir de cierta
-- antigüedad de cuenta y como máximo una vez al mes por usuario — para eso
-- se necesita recordar cuándo se le mostró la última vez a cada quien.
--
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

create table if not exists public.satisfaction_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  level smallint not null check (level between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists satisfaction_responses_created_at_idx
  on public.satisfaction_responses(created_at desc);
create index if not exists satisfaction_responses_user_id_idx
  on public.satisfaction_responses(user_id);

-- RLS activo y SIN políticas de cliente: mismo patrón que cancellation_feedback
-- y hotmart_events — solo el servidor (service_role) escribe y lee. Ningún
-- usuario del navegador puede ver ni falsificar la respuesta de otro.
alter table public.satisfaction_responses enable row level security;

-- Cuándo se le mostró el pop-up la última vez a cada usuario (aparezca o no
-- responda) — sin esto, alguien que cierra la encuesta sin contestar la
-- volvería a ver en la siguiente carga de página, en vez de esperar un mes.
alter table public.profiles add column if not exists last_satisfaction_survey_shown_at timestamptz;
