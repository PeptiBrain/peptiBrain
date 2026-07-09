-- Compartir con familia es exclusivo del plan Family. Antes no había ninguna
-- verificación en la base de datos, así que un usuario Free o Premium podía
-- invitar familiares igual (el front no lo mostraba, pero un llamado directo
-- a la API sí lo permitía). Esto lo cierra a nivel de base de datos.
drop policy if exists "family_insert_own" on public.family_members;
create policy "family_insert_own" on public.family_members for insert
  with check (
    (select auth.uid()) = owner_id
    and exists (
      select 1 from public.profiles p
      where p.id = owner_id and p.plan = 'family'
    )
  );
