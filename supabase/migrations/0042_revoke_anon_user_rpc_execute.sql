-- ============================================================================
-- PEPTIBRAIN — reset_tracking_progress() y set_daily_goal() solo deben poder
-- llamarse estando logueado (siempre lo hacen así desde el cliente). El
-- grant implícito por defecto a PUBLIC al crear la función dejaba a anon
-- (sin sesión) poder llamarlas vía RPC; aunque ambas ya eran no-op/inofensivas
-- para auth.uid() = null, se revoca por higiene y para que el advisor de
-- seguridad de Supabase quede limpio. Aplicado directo a producción vía
-- Supabase MCP el 2026-07-25.
-- ============================================================================

revoke execute on function public.reset_tracking_progress() from anon, public;
revoke execute on function public.set_daily_goal(integer) from anon, public;
