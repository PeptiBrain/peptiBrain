-- ============================================================================
-- PEPTIBRAIN — Auditoría de seguridad/rendimiento (Supabase advisors)
-- Cierra la puerta trasera de farmeo de PB: award_pb() era llamable directo
-- via RPC por anon/authenticated con cualquier user_id y monto arbitrario.
-- Las funciones de trigger (return type trigger) no son invocables directo
-- por Postgres, pero se revocan tambien por defensa en profundidad.
-- También corrige el search_path mutable de private.set_updated_at y agrega
-- los índices de foreign key que el advisor de performance marcó como
-- faltantes. Aplicado directo a producción vía Supabase MCP el 2026-07-25.
-- ============================================================================

revoke execute on function public.award_pb(uuid, integer) from anon, authenticated, public;
revoke execute on function public.award_pb_dose() from anon, authenticated, public;
revoke execute on function public.award_pb_health_log() from anon, authenticated, public;
revoke execute on function public.award_pb_lab_result() from anon, authenticated, public;
revoke execute on function public.award_pb_photo() from anon, authenticated, public;
revoke execute on function public.sync_streak_progress() from anon, authenticated, public;
revoke execute on function public.sync_idea_vote_count() from anon, authenticated, public;

alter function private.set_updated_at() set search_path = '';

create index if not exists assistant_questions_user_id_idx on public.assistant_questions(user_id);
create index if not exists doses_for_member_id_idx on public.doses(for_member_id);
create index if not exists error_log_user_id_idx on public.error_log(user_id);
create index if not exists hotmart_events_user_id_idx on public.hotmart_events(user_id);
create index if not exists ideas_user_id_idx on public.ideas(user_id);
create index if not exists profiles_family_seat_owner_id_idx on public.profiles(family_seat_owner_id);
create index if not exists vial_shares_member_id_idx on public.vial_shares(member_id);
create index if not exists vials_shared_with_member_id_idx on public.vials(shared_with_member_id);
