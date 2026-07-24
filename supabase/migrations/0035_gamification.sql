-- ============================================================================
-- PEPTIBRAIN — Gamificación: racha real en servidor + streak freeze
-- La racha, los congeladores y los puntos "PB" viven en el servidor y NUNCA
-- se pueden editar desde el cliente — solo cambian vía el trigger de abajo
-- (al registrar una dosis o un log de salud) o vía set_daily_goal() para la
-- meta diaria, que sí es una preferencia del usuario.
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  pb_total integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_on date,
  freezes integer not null default 0,
  daily_goal integer not null default 20 check (daily_goal in (10, 20, 30, 50)),
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

-- Solo lectura desde el cliente. Nada de INSERT/UPDATE directo: todo pasa por
-- el trigger (SECURITY DEFINER) o por set_daily_goal() de abajo.
drop policy if exists "user_progress_own_select" on public.user_progress;
create policy "user_progress_own_select" on public.user_progress
  for select to authenticated using (user_id = (select auth.uid()));

-- Racha + freeze (misma lógica documentada en docs/sistema/24-GAMIFICACION.md):
-- si ya contó hoy no hace nada; si es el primer día empieza en 1; si fue ayer
-- suma 1; si hay un hueco de días lo cubre con congeladores (1 por día
-- perdido) o reinicia la racha en 1 si no alcanzan. Cada 7 días de racha
-- consecutiva regala 1 congelador (máximo 2 guardados a la vez).
create or replace function public.sync_streak_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_row public.user_progress;
  v_today date := current_date;
  v_days_gap integer;
  v_days_lost integer;
  v_new_streak integer;
  v_new_freezes integer;
begin
  v_user_id := coalesce(new.user_id, old.user_id);
  if v_user_id is null then
    return new;
  end if;

  insert into public.user_progress (user_id)
  values (v_user_id)
  on conflict (user_id) do nothing;

  select * into v_row from public.user_progress where user_id = v_user_id for update;

  if v_row.last_active_on = v_today then
    return new; -- ya contó hoy, sin cambios
  end if;

  if v_row.last_active_on is null then
    v_new_streak := 1;
    v_new_freezes := v_row.freezes;
  else
    v_days_gap := v_today - v_row.last_active_on;
    if v_days_gap = 1 then
      v_new_streak := v_row.current_streak + 1;
      v_new_freezes := v_row.freezes;
    else
      v_days_lost := v_days_gap - 1;
      if v_days_lost <= v_row.freezes then
        v_new_streak := v_row.current_streak + 1;
        v_new_freezes := v_row.freezes - v_days_lost;
      else
        v_new_streak := 1;
        v_new_freezes := v_row.freezes;
      end if;
    end if;
  end if;

  -- Regalo de congelador cada 7 días de racha (máximo 2 guardados).
  if v_new_streak > 0 and v_new_streak % 7 = 0 then
    v_new_freezes := least(v_new_freezes + 1, 2);
  end if;

  update public.user_progress
    set current_streak = v_new_streak,
        longest_streak = greatest(longest_streak, v_new_streak),
        freezes = v_new_freezes,
        last_active_on = v_today,
        updated_at = now()
    where user_id = v_user_id;

  return new;
end;
$$;

drop trigger if exists doses_streak_trigger on public.doses;
create trigger doses_streak_trigger
  after update on public.doses
  for each row
  when (new.done = true and old.done is distinct from true)
  execute function public.sync_streak_progress();

drop trigger if exists health_logs_streak_trigger on public.health_logs;
create trigger health_logs_streak_trigger
  after insert or update on public.health_logs
  for each row
  execute function public.sync_streak_progress();

-- Única forma en que el cliente puede tocar user_progress: elegir su meta
-- diaria (10/20/30/50 puntos PB) — es preferencia, no progreso, así que no
-- hace falta el trigger de arriba para esto.
create or replace function public.set_daily_goal(new_goal integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if new_goal not in (10, 20, 30, 50) then
    raise exception 'INVALID_GOAL';
  end if;
  insert into public.user_progress (user_id, daily_goal)
  values ((select auth.uid()), new_goal)
  on conflict (user_id) do update set daily_goal = excluded.daily_goal, updated_at = now();
end;
$$;

grant execute on function public.set_daily_goal(integer) to authenticated;
