-- La caducidad de un vial se cuenta desde que se MEZCLA con agua, no desde que
-- se compra. Hasta ahora se usaba created_at como aproximación, así que quien
-- guardaba el vial en seco y lo reconstituía semanas después veía una fecha de
-- caducidad falsa (más temprana de la real) — justo al revés de lo que hace
-- falta en una app que avisa de desperdicio.
--
-- Nullable a propósito: los viales que ya existen se quedan en NULL y el código
-- sigue usando created_at para ellos, igual que hasta ahora. Nada se rompe ni
-- se recalcula hacia atrás.
alter table public.vials add column if not exists reconstituted_at timestamptz;

comment on column public.vials.reconstituted_at is
  'Cuándo se mezcló el vial con agua bacteriostática. NULL = se desconoce, se usa created_at como aproximación.';
