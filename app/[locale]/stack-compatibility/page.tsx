import { notFound } from "next/navigation";
import OriginalPage, { generateMetadata as originalGenerateMetadata } from "../compatibilidad/page";

// URL en inglés real de esta página (antes /en/compatibilidad reusaba el segmento en
// español) — nunca sirve en español, esa sigue viviendo en /compatibilidad.
export const generateMetadata = originalGenerateMetadata;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <OriginalPage params={params} />;
}
