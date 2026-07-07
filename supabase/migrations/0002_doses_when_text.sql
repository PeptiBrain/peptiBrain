-- La app guarda "cuándo" como texto libre elegido por el usuario (ej. "Mañana 8am"),
-- no una fecha exacta parseable — se ajusta la columna para reflejar eso.
alter table public.doses drop column if exists when_at;
alter table public.doses add column if not exists when_label text not null default '';
alter table public.doses alter column when_label drop default;

drop index if exists doses_user_when_idx;
create index if not exists doses_user_created_idx on public.doses(user_id, created_at desc);
