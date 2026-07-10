-- Asientos extra de Family (5€/mes cada uno, más allá de las 3 cuentas base).
-- Una fila por suscripción de Hotmart activa, para no depender de recalcular
-- nada: el tope real de invitados = 2 + count(status='active') de esta tabla.
create table if not exists public.family_extra_seats (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  subscriber_code text not null unique,
  status text not null default 'active' check (status in ('active', 'canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists family_extra_seats_owner_active_idx
  on public.family_extra_seats (owner_id)
  where status = 'active';

alter table public.family_extra_seats enable row level security;

-- Solo lectura de las propias; toda escritura pasa por el webhook (service_role).
create policy family_extra_seats_select_own on public.family_extra_seats
  for select using (owner_id = (select auth.uid()));
