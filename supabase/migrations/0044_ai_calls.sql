-- ============================================================================
-- PEPTIBRAIN — Costo REAL de IA (antes el panel mostraba un 0 fijo a mano)
--
-- `lib/admin-data.ts` tenía `const aiCostEstimate = 0;` — un número inventado,
-- no medido. Con el modelo gratuito de hoy el costo real ES 0, así que el
-- número casualmente acertaba; el problema es que el día que se cambie a un
-- modelo de pago seguiría diciendo 0 y el dueño se enteraría por la factura.
--
-- Esta tabla registra CADA llamada al modelo con sus tokens y su costo, para
-- que el panel muestre gasto real por día/mes y por función.
--
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

create table if not exists public.ai_calls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  -- Qué función de la app hizo la llamada ("assistant", y las que vengan).
  feature text not null,
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  -- Costo en USD calculado en el servidor con el precio del modelo vigente.
  -- numeric(12,6) para no perder céntimos con volúmenes altos.
  cost_usd numeric(12,6) not null default 0,
  created_at timestamptz not null default now()
);

-- El panel filtra por fecha y agrupa por función: estos dos índices cubren
-- ambas consultas.
create index if not exists ai_calls_created_at_idx on public.ai_calls(created_at desc);
create index if not exists ai_calls_feature_idx on public.ai_calls(feature);
create index if not exists ai_calls_user_id_idx on public.ai_calls(user_id);

-- RLS activo y SIN políticas: igual que hotmart_events y pending_purchases,
-- esta tabla solo la escribe/lee el servidor con la service_role key (que
-- salta RLS por diseño). Ningún usuario del navegador puede tocarla.
alter table public.ai_calls enable row level security;
