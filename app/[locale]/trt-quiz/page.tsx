import { notFound } from "next/navigation";
import OriginalPage, { generateMetadata as originalGenerateMetadata } from "../quiz-trt/page";

// URL en inglés real de esta página (antes /en/quiz-trt reusaba el segmento en
// español) — nunca sirve en español, esa sigue viviendo en /quiz-trt.
export const generateMetadata = originalGenerateMetadata;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <OriginalPage params={params} />;
}
