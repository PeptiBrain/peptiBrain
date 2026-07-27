-- ============================================================================
-- PEPTIBRAIN — Motivo de cancelación (antes se perdía sin registrar por qué
-- alguien pulsaba "Cancelar suscripción")
--
-- Cada cancelación sin motivo es una oportunidad perdida de aprendizaje: sin
-- esto no se puede saber si el problema es precio, onboarding, comunicación
-- o expectativa. Esta tabla guarda la respuesta de la encuesta de un clic que
-- aparece justo antes de las instrucciones de cancelar.
--
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

create table if not exists public.cancellation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  -- Motivo de opción única: no_esperaba | plan_gratis_basta | no_entendi |
  -- miedo_cobro | muy_caro | no_tiempo | otro. Validado en el servidor
  -- (app/api/account/cancel-feedback), no aquí, para poder agregar motivos
  -- nuevos sin migración.
  reason text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists cancellation_feedback_created_at_idx
  on public.cancellation_feedback(created_at desc);
create index if not exists cancellation_feedback_reason_idx
  on public.cancellation_feedback(reason);

-- RLS activo y SIN políticas: igual que hotmart_events y ai_calls, esta tabla
-- solo la escribe/lee el servidor con la service_role key. Ningún usuario del
-- navegador puede leer los motivos de otros ni falsificar los suyos.
alter table public.cancellation_feedback enable row level security;
