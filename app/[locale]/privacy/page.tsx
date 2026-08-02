import { notFound } from "next/navigation";
import OriginalPage from "../privacidad/page";

// URL en inglés real de esta página (antes /en/privacidad reusaba el segmento en
// español) — nunca sirve en español, esa sigue viviendo en /privacidad.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <OriginalPage />;
}
