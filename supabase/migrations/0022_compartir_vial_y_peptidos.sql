-- Elegir péptidos específicos a compartir con cada familiar (en vez de todo o nada)
alter table public.family_members add column if not exists shared_peptide_ids uuid[];

-- Compartir un vial físico con un familiar: reparto de costo (%) y de dosis reales
alter table public.vials add column if not exists shared_with_member_id uuid references public.family_members(id) on delete set null;
alter table public.vials add column if not exists split_percent smallint check (split_percent between 1 and 99);

-- Marcar para quién es una dosis, cuando el vial es compartido (null = para mí)
alter table public.doses add column if not exists for_member_id uuid references public.family_members(id) on delete set null;
