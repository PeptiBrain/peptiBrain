import { notFound } from "next/navigation";
import OriginalPage from "../terminos/page";

// URL en inglés real de esta página (antes /en/terminos reusaba el segmento en
// español) — nunca sirve en español, esa sigue viviendo en /terminos.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <OriginalPage />;
}
