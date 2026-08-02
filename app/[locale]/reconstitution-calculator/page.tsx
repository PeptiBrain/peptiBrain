import { notFound } from "next/navigation";
import OriginalPage, { generateMetadata as originalGenerateMetadata } from "../calculadora/page";

// URL en inglés real de esta página (antes /en/calculadora reusaba el segmento en
// español) — nunca sirve en español, esa sigue viviendo en /calculadora.
export const generateMetadata = originalGenerateMetadata;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <OriginalPage params={params} searchParams={searchParams} />;
}
