-- ============================================================================
-- PEPTIBRAIN — Esquema inicial (snake_case, RLS-ready)
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create extension if not exists "pgcrypto";

create schema if not exists private;

create or replace function private.set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ---------------------------------------------------------------------------
-- 1. profiles — extiende auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  name                    text not null check (length(name) between 1 and 120),
  email                   text not null,
  phone_code              text,
  phone                   text,
  plan                    text not null default 'free'
                          check (plan in ('free','premium','family')),
  plan_status             text not null default 'active'
                          check (plan_status in ('active','past_due','canceled','refunded')),
  onboarding_completed_at timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create unique index profiles_email_idx on public.profiles(email);

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();

create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email);
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. peptides
-- ---------------------------------------------------------------------------
create table public.peptides (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null check (length(name) between 1 and 120),
  route         text not null,
  typical_dose  numeric check (typical_dose > 0),
  typical_unit  text not null default 'mg' check (typical_unit in ('mg','mcg','iu','ml')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index peptides_user_id_idx on public.peptides(user_id);
create trigger peptides_set_updated_at before update on public.peptides
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. vials
-- ---------------------------------------------------------------------------
create table public.vials (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  peptide_id    uuid not null references public.peptides(id) on delete cascade,
  amount        numeric not null check (amount > 0),
  unit          text not null check (unit in ('mg','mcg','iu','ml')),
  bac_water     numeric check (bac_water >= 0),
  syringe_type  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index vials_user_id_idx on public.vials(user_id);
create index vials_peptide_id_idx on public.vials(peptide_id);
create trigger vials_set_updated_at before update on public.vials
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. doses
-- ---------------------------------------------------------------------------
create table public.doses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  peptide_id      uuid not null references public.peptides(id) on delete cascade,
  amount          numeric not null check (amount > 0),
  unit            text not null check (unit in ('mg','mcg','iu','ml')),
  when_at         timestamptz not null,
  done            boolean not null default false,
  injection_site  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index doses_user_id_idx on public.doses(user_id);
create index doses_peptide_id_idx on public.doses(peptide_id);
create index doses_user_when_idx on public.doses(user_id, when_at desc);
create trigger doses_set_updated_at before update on public.doses
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. health_logs
-- ---------------------------------------------------------------------------
create table public.health_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  log_date      date not null,
  weight_kg     numeric check (weight_kg > 0),
  hydration_ml  integer check (hydration_ml >= 0),
  exercise_min  integer check (exercise_min >= 0),
  side_effect   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index health_logs_user_date_idx on public.health_logs(user_id, log_date);
create trigger health_logs_set_updated_at before update on public.health_logs
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- 6. family_members — comparten datos del dueño por email (share pasivo, sin cuenta propia todavía)
-- ---------------------------------------------------------------------------
create table public.family_members (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  name          text not null check (length(name) between 1 and 120),
  email         text not null,
  visibility    text not null default 'resumen' check (visibility in ('resumen','completo')),
  invite_status text not null default 'pending' check (invite_status in ('pending','accepted','revoked')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index family_members_owner_id_idx on public.family_members(owner_id);
create unique index family_members_owner_email_idx on public.family_members(owner_id, email);
create trigger family_members_set_updated_at before update on public.family_members
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- 7. hotmart_events — idempotencia del webhook de venta (solo el servidor la toca)
-- ---------------------------------------------------------------------------
create table public.hotmart_events (
  event_id      text primary key,
  user_id       uuid references auth.users(id) on delete set null,
  event_type    text not null,
  payload       jsonb not null,
  processed_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.peptides       enable row level security;
alter table public.vials          enable row level security;
alter table public.doses          enable row level security;
alter table public.health_logs    enable row level security;
alter table public.family_members enable row level security;
alter table public.hotmart_events enable row level security; -- sin políticas -> nadie del cliente entra

create policy "profiles_select_own" on public.profiles for select
  using ( (select auth.uid()) = id );
create policy "profiles_update_own" on public.profiles for update
  using ( (select auth.uid()) = id ) with check ( (select auth.uid()) = id );

create policy "peptides_select_own" on public.peptides for select
  using ( (select auth.uid()) = user_id );
create policy "peptides_insert_own" on public.peptides for insert
  with check ( (select auth.uid()) = user_id );
create policy "peptides_update_own" on public.peptides for update
  using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "peptides_delete_own" on public.peptides for delete
  using ( (select auth.uid()) = user_id );

create policy "vials_select_own" on public.vials for select
  using ( (select auth.uid()) = user_id );
create policy "vials_insert_own" on public.vials for insert
  with check ( (select auth.uid()) = user_id );
create policy "vials_update_own" on public.vials for update
  using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "vials_delete_own" on public.vials for delete
  using ( (select auth.uid()) = user_id );

create policy "doses_select_own" on public.doses for select
  using ( (select auth.uid()) = user_id );
create policy "doses_insert_own" on public.doses for insert
  with check ( (select auth.uid()) = user_id );
create policy "doses_update_own" on public.doses for update
  using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "doses_delete_own" on public.doses for delete
  using ( (select auth.uid()) = user_id );

create policy "health_logs_select_own" on public.health_logs for select
  using ( (select auth.uid()) = user_id );
create policy "health_logs_insert_own" on public.health_logs for insert
  with check ( (select auth.uid()) = user_id );
create policy "health_logs_update_own" on public.health_logs for update
  using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "health_logs_delete_own" on public.health_logs for delete
  using ( (select auth.uid()) = user_id );

create policy "family_select_own" on public.family_members for select
  using ( (select auth.uid()) = owner_id );
create policy "family_insert_own" on public.family_members for insert
  with check ( (select auth.uid()) = owner_id );
create policy "family_update_own" on public.family_members for update
  using ( (select auth.uid()) = owner_id ) with check ( (select auth.uid()) = owner_id );
create policy "family_delete_own" on public.family_members for delete
  using ( (select auth.uid()) = owner_id );
