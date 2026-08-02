import { notFound } from "next/navigation";
import OriginalPage, { generateMetadata as originalGenerateMetadata } from "../comparador/page";

// URL en inglés real de esta página (antes /en/comparador reusaba el segmento en
// español) — nunca sirve en español, esa sigue viviendo en /comparador.
export const generateMetadata = originalGenerateMetadata;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <OriginalPage params={params} />;
}
