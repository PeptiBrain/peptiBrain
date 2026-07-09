-- Teléfono/WhatsApp del familiar, para poder contactarlo directo (llamar o WhatsApp)
-- desde su tarjeta. El correo sigue siendo lo que conecta su cuenta con la tuya
-- (el teléfono no está verificado, así que no se puede usar para eso todavía).
alter table public.family_members add column if not exists phone text;
alter table public.family_members add column if not exists phone_code text;
