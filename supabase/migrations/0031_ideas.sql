-- Tablero público de Ideas / Feature Requests: los usuarios registrados proponen
-- mejoras y votan las de otros (solo upvote). El dueño (role='admin') mueve cada
-- idea por estados (open→planned→in_progress→done | declined), que alimentan el
-- Roadmap. Cualquiera puede LEER el tablero (bueno para SEO), pero proponer/votar
-- exige sesión. El conteo de votos se mantiene denormalizado (ideas.vote_count)
-- vía trigger, para que listar y ordenar por votos sea trivial y escale bien.

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 3 and 120),
  description text check (char_length(description) <= 2000),
  category text not null default 'otra',
  status text not null default 'open'
    check (status in ('open', 'planned', 'in_progress', 'done', 'declined')),
  vote_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ideas_status_idx on public.ideas (status);
create index if not exists ideas_vote_count_idx on public.ideas (vote_count desc);
create index if not exists ideas_created_at_idx on public.ideas (created_at desc);

create table if not exists public.idea_votes (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (idea_id, user_id)
);

create index if not exists idea_votes_idea_id_idx on public.idea_votes (idea_id);
create index if not exists idea_votes_user_id_idx on public.idea_votes (user_id);

-- Mantiene ideas.vote_count al día cuando se añade o quita un voto.
create or replace function public.sync_idea_vote_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.ideas set vote_count = vote_count + 1 where id = new.idea_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.ideas set vote_count = greatest(vote_count - 1, 0) where id = old.idea_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists idea_votes_count_trigger on public.idea_votes;
create trigger idea_votes_count_trigger
  after insert or delete on public.idea_votes
  for each row execute function public.sync_idea_vote_count();

-- RLS ---------------------------------------------------------------------------
alter table public.ideas enable row level security;
alter table public.idea_votes enable row level security;

-- Cualquiera (anónimo o con sesión) puede LEER el tablero.
create policy ideas_select_all on public.ideas
  for select to anon, authenticated using (true);

-- Solo usuarios con sesión crean ideas, y siempre a su propio nombre.
create policy ideas_insert_own on public.ideas
  for insert to authenticated with check (user_id = (select auth.uid()));

-- Solo el dueño (admin) cambia el estado / edita una idea.
create policy ideas_update_admin on public.ideas
  for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- Los votos son públicos de leer (para contar/mostrar quién votó qué en su propia UI).
create policy idea_votes_select_all on public.idea_votes
  for select to anon, authenticated using (true);

-- Cada usuario con sesión vota (una vez por idea, garantizado por el unique) a su nombre.
create policy idea_votes_insert_own on public.idea_votes
  for insert to authenticated with check (user_id = (select auth.uid()));

-- Y puede retirar SU propio voto.
create policy idea_votes_delete_own on public.idea_votes
  for delete to authenticated using (user_id = (select auth.uid()));
