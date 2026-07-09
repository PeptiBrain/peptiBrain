-- ============================================================================
-- PEPTIBRAIN — Oferta de fundadores: pago único "de por vida", primeros 100 cupos
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

alter table public.profiles add column if not exists is_lifetime boolean not null default false;
alter table public.pending_purchases add column if not exists is_lifetime boolean not null default false;

-- El trigger que aplica una compra pendiente al crear el perfil también debe
-- copiar is_lifetime (si no, alguien que compró de por vida ANTES de registrarse
-- perdería esa marca al crear su cuenta).
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
    update public.profiles
      set plan = pending.plan, plan_status = pending.plan_status, is_lifetime = pending.is_lifetime
      where id = new.id;
    delete from public.pending_purchases where id = pending.id;
  end if;

  return new;
end; $$;
