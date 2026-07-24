-- ============================================================================
-- PEPTIBRAIN — Fotos de progreso
-- Tabla + bucket PRIVADO (a diferencia de avatars, que es público) para que
-- cada usuario guarde fotos de su propio cuerpo con fecha, y vea su evolución
-- en el tiempo. Nadie más puede ver ni listar las fotos de otro usuario.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  storage_path text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists progress_photos_user_date_idx on public.progress_photos (user_id, log_date desc);

alter table public.progress_photos enable row level security;

drop policy if exists "progress_photos_own_select" on public.progress_photos;
create policy "progress_photos_own_select" on public.progress_photos
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "progress_photos_own_insert" on public.progress_photos;
create policy "progress_photos_own_insert" on public.progress_photos
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "progress_photos_own_delete" on public.progress_photos;
create policy "progress_photos_own_delete" on public.progress_photos
  for delete to authenticated using (user_id = (select auth.uid()));

-- Bucket PRIVADO — a diferencia de avatars, nadie más puede ver estas fotos.
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

drop policy if exists "progress_photos_storage_own_select" on storage.objects;
create policy "progress_photos_storage_own_select" on storage.objects for select
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "progress_photos_storage_own_insert" on storage.objects;
create policy "progress_photos_storage_own_insert" on storage.objects for insert
  with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "progress_photos_storage_own_delete" on storage.objects;
create policy "progress_photos_storage_own_delete" on storage.objects for delete
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
