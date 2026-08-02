import { notFound } from "next/navigation";
import OriginalPage from "../descargar/page";

// URL en inglés real de esta página (antes /en/descargar reusaba el segmento en
// español) — nunca sirve en español, esa sigue viviendo en /descargar.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <OriginalPage />;
}
