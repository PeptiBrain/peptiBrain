-- Un vial se podía compartir con UN SOLO familiar (columnas shared_with_member_id
-- + split_percent en vials). Se puede compartir con VARIOS a la vez, cada uno
-- con su propio %. Se pasa a una tabla aparte; las columnas viejas se dejan
-- (no se borran) y se rellena la nueva tabla con lo que ya existía.

create table if not exists public.vial_shares (
  id uuid primary key default gen_random_uuid(),
  vial_id uuid not null references public.vials(id) on delete cascade,
  member_id uuid not null references public.family_members(id) on delete cascade,
  percent smallint not null check (percent between 1 and 99),
  created_at timestamptz not null default now(),
  unique (vial_id, member_id)
);
create index if not exists vial_shares_vial_id_idx on public.vial_shares(vial_id);

alter table public.vial_shares enable row level security;

create policy "vial_shares_all_own" on public.vial_shares for all
  using (
    exists (select 1 from public.vials v where v.id = vial_shares.vial_id and v.user_id = (select auth.uid()))
  )
  with check (
    exists (select 1 from public.vials v where v.id = vial_shares.vial_id and v.user_id = (select auth.uid()))
  );

insert into public.vial_shares (vial_id, member_id, percent)
select id, shared_with_member_id, 100 - split_percent
from public.vials
where shared_with_member_id is not null and split_percent is not null
on conflict (vial_id, member_id) do nothing;
