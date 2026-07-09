-- Recordatorios de dosis reales (notificaciones push) + Modo viaje (pausa automática
-- durante viajes registrados). Antes ambos estaban marcados "Pronto" en el menú.

alter table public.profiles add column if not exists reminders_enabled boolean not null default false;

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

create policy "push_subscriptions_select_own" on public.push_subscriptions for select
  using ( (select auth.uid()) = user_id );
create policy "push_subscriptions_insert_own" on public.push_subscriptions for insert
  with check ( (select auth.uid()) = user_id );
create policy "push_subscriptions_delete_own" on public.push_subscriptions for delete
  using ( (select auth.uid()) = user_id );

alter table public.doses add column if not exists reminded_at timestamptz;
