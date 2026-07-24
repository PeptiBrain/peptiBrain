-- ============================================================================
-- PEPTIBRAIN — Puntos PB (Pepti Brain) por acción real (capa 3 de gamificación)
-- Se otorgan SOLO en el servidor, al registrar algo real — nunca por repetir
-- o editar lo mismo el mismo día (los triggers de health_logs/lab_results/
-- fotos son AFTER INSERT, no UPDATE, para no premiar "farmear").
-- Correr una sola vez en: Supabase Dashboard -> SQL Editor -> New query -> pegar y Run
-- ============================================================================

create or replace function public.award_pb(p_user_id uuid, p_amount integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_progress (user_id, pb_total)
  values (p_user_id, greatest(p_amount, 0))
  on conflict (user_id) do update
    set pb_total = public.user_progress.pb_total + greatest(p_amount, 0),
        updated_at = now();
end;
$$;

-- Dosis registrada: +10 PB. Reusa la misma condición que ya dispara la racha.
create or replace function public.award_pb_dose()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_pb(new.user_id, 10);
  return new;
end;
$$;

drop trigger if exists doses_pb_trigger on public.doses;
create trigger doses_pb_trigger
  after update on public.doses
  for each row
  when (new.done = true and old.done is distinct from true)
  execute function public.award_pb_dose();

-- Log de salud (peso/hidratación/ejercicio/efecto) el primer registro del
-- día: +10 PB. Solo AFTER INSERT — editar el mismo día es UPDATE y no premia de nuevo.
create or replace function public.award_pb_health_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_pb(new.user_id, 10);
  return new;
end;
$$;

drop trigger if exists health_logs_pb_trigger on public.health_logs;
create trigger health_logs_pb_trigger
  after insert on public.health_logs
  for each row
  execute function public.award_pb_health_log();

-- Foto de progreso subida: +15 PB.
create or replace function public.award_pb_photo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_pb(new.user_id, 15);
  return new;
end;
$$;

drop trigger if exists progress_photos_pb_trigger on public.progress_photos;
create trigger progress_photos_pb_trigger
  after insert on public.progress_photos
  for each row
  execute function public.award_pb_photo();

-- Análisis de sangre registrado: +20 PB.
create or replace function public.award_pb_lab_result()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_pb(new.user_id, 20);
  return new;
end;
$$;

drop trigger if exists lab_results_pb_trigger on public.lab_results;
create trigger lab_results_pb_trigger
  after insert on public.lab_results
  for each row
  execute function public.award_pb_lab_result();
