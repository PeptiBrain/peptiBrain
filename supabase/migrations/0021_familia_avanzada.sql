-- Familia: foto, relación (hermano, pareja, amigo...) y permisos reales por zona
-- (antes "resumen/completo" existía en la pantalla pero loadSharedOwnerData()
-- ignoraba el valor y siempre devolvía todo — este cambio lo hace real).
-- Nota: la columna "visibility" vieja se deja tal cual (no se borra) por si acaso;
-- el código ya no la usa a partir de esta migración.

alter table public.family_members add column if not exists relationship text;
alter table public.family_members add column if not exists photo_url text;
alter table public.family_members add column if not exists share_peptides boolean not null default true;
alter table public.family_members add column if not exists share_doses boolean not null default true;
alter table public.family_members add column if not exists share_health boolean not null default false;

update public.family_members set
  share_doses = (visibility = 'completo'),
  share_health = (visibility = 'completo')
where visibility is not null;

-- ============================================================================
-- Centro de notificaciones dentro de la app (campana)
-- ============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_id_idx on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications for select
  using ( (select auth.uid()) = user_id );
create policy "notifications_update_own" on public.notifications for update
  using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
-- Sin política de insert para usuarios normales: solo las crean los triggers
-- de abajo (SECURITY DEFINER) o el cron de recordatorios (con la service_role key).

-- Al crear una invitación de familia, notifica a la persona invitada (si ya
-- tiene cuenta en PeptiBrain con ese correo).
create or replace function private.notify_family_invite() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  invitee_id uuid;
  owner_name text;
begin
  select id into invitee_id from public.profiles where lower(email) = lower(new.email) limit 1;
  if invitee_id is not null then
    select coalesce(name, 'Alguien') into owner_name from public.profiles where id = new.owner_id;
    insert into public.notifications (user_id, type, title, body, link)
    values (
      invitee_id,
      'family_invite',
      'Nueva invitación de familia',
      owner_name || ' te invitó a ver su progreso en PeptiBrain.',
      '/app/familia'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists family_members_notify_invite on public.family_members;
create trigger family_members_notify_invite
  after insert on public.family_members
  for each row execute function private.notify_family_invite();

-- Cuando el invitado acepta o rechaza, notifica al dueño.
create or replace function private.notify_family_response() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  guest_name text;
begin
  if new.invite_status is distinct from old.invite_status and new.invite_status in ('accepted', 'revoked') then
    guest_name := coalesce(new.name, new.email);
    insert into public.notifications (user_id, type, title, body, link)
    values (
      new.owner_id,
      'family_response',
      case when new.invite_status = 'accepted' then 'Invitación aceptada' else 'Invitación rechazada' end,
      guest_name || case
        when new.invite_status = 'accepted' then ' aceptó tu invitación de familia.'
        else ' rechazó tu invitación de familia.'
      end,
      '/app/familia'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists family_members_notify_response on public.family_members;
create trigger family_members_notify_response
  after update on public.family_members
  for each row execute function private.notify_family_response();
