import { createClient } from "@/lib/supabase/client";

// Favoritos de la Biblioteca de péptidos — solo para usuarios con sesión
// (igual que "Seguir" en el carrusel de la home: la biblioteca se navega
// gratis, pero guardar algo tuyo pide cuenta). Devuelve un Set vacío si no
// hay sesión, nunca un error — la Biblioteca sigue funcionando sin login.
export async function loadFavoritePeptides(): Promise<Set<string>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase.from("favorite_peptides").select("peptide_name").eq("user_id", user.id);
  return new Set((data || []).map((r) => r.peptide_name));
}

// Devuelve null si no hay sesión (el llamador debe mandar a /login), o el
// nuevo estado (true = ahora es favorito) si la operación se hizo bien.
export async function toggleFavoritePeptide(name: string, isFavorite: boolean): Promise<boolean | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  if (isFavorite) {
    await supabase.from("favorite_peptides").delete().eq("user_id", user.id).eq("peptide_name", name);
    return false;
  }
  await supabase.from("favorite_peptides").insert({ user_id: user.id, peptide_name: name });
  return true;
}
