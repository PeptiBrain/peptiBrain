import { notFound } from "next/navigation";
import OriginalPage from "../aviso-legal/page";

// URL en inglés real de esta página (antes /en/aviso-legal reusaba el segmento en
// español) — nunca sirve en español, esa sigue viviendo en /aviso-legal.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <OriginalPage />;
}
