-- Palancas de retención:
-- - vials.low_stock_notified_at: para avisar UNA sola vez cuando a un vial le
--   quedan pocas dosis ("se te acaba el vial"), sin repetir el aviso cada día.
-- - profiles.winback_sent_at: para el re-enganche de quien lleva días sin entrar,
--   sin mandarle el empujón todos los días (máx 1 cada ~7 días).
alter table public.vials add column if not exists low_stock_notified_at timestamptz;
alter table public.profiles add column if not exists winback_sent_at timestamptz;
