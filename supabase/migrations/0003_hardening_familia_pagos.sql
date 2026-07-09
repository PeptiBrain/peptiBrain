-- ============================================================================
-- PEPTIBRAIN — Auditoría 2026-07-07: refuerzos de seguridad, pagos y Familia real
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. plan_status: agregar 'chargeback' (antes solo existía 'refunded' para bajas)
-- ---------------------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_plan_status_check;
alter table public.profiles add constraint profiles_plan_status_check
  check (plan_status in ('active','past_due','canceled','refunded','chargeback'));

-- ---------------------------------------------------------------------------
-- 2. pending_purchases — cuando el webhook de Hotmart no encuentra el perfil
--    (el comprador aún no se registró en la app), guardamos el pago aquí y lo
--    aplicamos automáticamente cuando esa persona finalmente crea su cuenta.
-- ---------------------------------------------------------------------------
create table if not exists public.pending_purchases (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  plan         text not null check (plan in ('premium','family')),
  plan_status  text not null default 'active',
  created_at   timestamptz not null default now()
);
create index if not exists pending_purchases_email_idx on public.pending_purchases(lower(email));
alter table public.pending_purchases enable row level security; -- sin políticas -> solo service role

-- Al crear un perfil nuevo, si hay una compra pendiente con su correo, se aplica y se borra.
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  pending record;
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email);

  select * into pending from public.pending_purchases
    where lower(email) = lower(new.email)
    order by created_at desc limit 1;

  if found then
    update public.profiles set plan = pending.plan, plan_status = pending.plan_status
      where id = new.id;
    delete from public.pending_purchases where id = pending.id;
  end if;

  return new;
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Teléfono: validar formato también en el servidor (antes solo en el navegador)
-- ---------------------------------------------------------------------------
-- Limpia primero los teléfonos ya guardados que no cumplan el formato nuevo
-- (ej. vacíos o con menos de 7 dígitos), para que la restricción no falle.
update public.profiles
  set phone = null
  where phone is not null
    and length(regexp_replace(phone, '\D', '', 'g')) not between 7 and 15;

alter table public.profiles drop constraint if exists profiles_phone_format_check;
alter table public.profiles add constraint profiles_phone_format_check
  check (phone is null or (length(regexp_replace(phone, '\D', '', 'g')) between 7 and 15));

-- ---------------------------------------------------------------------------
-- 4. Límite del plan Gratis aplicado en el SERVIDOR (antes solo se revisaba en
--    el navegador — un doble clic o dos pestañas podían saltárselo).
-- ---------------------------------------------------------------------------
create or replace function private.enforce_plan_limit() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  user_plan text;
  current_count integer;
  max_allowed integer := 1;
begin
  select plan into user_plan from public.profiles where id = new.user_id;
  if user_plan is null or user_plan <> 'free' then
    return new;
  end if;

  if tg_table_name = 'peptides' then
    select count(*) into current_count from public.peptides where user_id = new.user_id;
  else
    select count(*) into current_count from public.vials where user_id = new.user_id;
  end if;

  if current_count >= max_allowed then
    raise exception 'PLAN_LIMIT_REACHED' using errcode = 'P0001';
  end if;

  return new;
end; $$;

drop trigger if exists peptides_enforce_plan_limit on public.peptides;
create trigger peptides_enforce_plan_limit before insert on public.peptides
  for each row execute function private.enforce_plan_limit();

drop trigger if exists vials_enforce_plan_limit on public.vials;
create trigger vials_enforce_plan_limit before insert on public.vials
  for each row execute function private.enforce_plan_limit();

-- ---------------------------------------------------------------------------
-- 5. Familia real: el invitado (ya con su propia cuenta, mismo correo de la
--    invitación) puede ACEPTAR y luego LEER (solo lectura) los datos del dueño.
-- ---------------------------------------------------------------------------

-- El invitado necesita ver su propia fila de invitación (antes solo el dueño la veía).
create policy "family_select_as_guest" on public.family_members for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and lower(p.email) = lower(family_members.email)
    )
  );

-- El invitado puede aceptar (cambiar invite_status) su propia invitación.
create policy "family_update_as_guest" on public.family_members for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and lower(p.email) = lower(family_members.email)
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and lower(p.email) = lower(family_members.email)
    )
  );

-- Lectura compartida: péptidos/viales/dosis/salud del dueño, solo si ya aceptó.
create policy "peptides_select_shared" on public.peptides for select
  using (
    exists (
      select 1 from public.family_members fm
      join public.profiles p on lower(p.email) = lower(fm.email)
      where fm.owner_id = peptides.user_id
        and p.id = (select auth.uid())
        and fm.invite_status = 'accepted'
    )
  );

create policy "vials_select_shared" on public.vials for select
  using (
    exists (
      select 1 from public.family_members fm
      join public.profiles p on lower(p.email) = lower(fm.email)
      where fm.owner_id = vials.user_id
        and p.id = (select auth.uid())
        and fm.invite_status = 'accepted'
    )
  );

create policy "doses_select_shared" on public.doses for select
  using (
    exists (
      select 1 from public.family_members fm
      join public.profiles p on lower(p.email) = lower(fm.email)
      where fm.owner_id = doses.user_id
        and p.id = (select auth.uid())
        and fm.invite_status = 'accepted'
    )
  );

create policy "health_logs_select_shared" on public.health_logs for select
  using (
    exists (
      select 1 from public.family_members fm
      join public.profiles p on lower(p.email) = lower(fm.email)
      where fm.owner_id = health_logs.user_id
        and p.id = (select auth.uid())
        and fm.invite_status = 'accepted'
    )
  );

-- El invitado también necesita ver el NOMBRE del dueño (para mostrar "Compartido por Jose").
create policy "profiles_select_as_shared_owner" on public.profiles for select
  using (
    exists (
      select 1 from public.family_members fm
      join public.profiles gp on lower(gp.email) = lower(fm.email)
      where fm.owner_id = profiles.id
        and gp.id = (select auth.uid())
        and fm.invite_status = 'accepted'
    )
  );
