import Image from "next/image";
import { Link } from "@/i18n/navigation";

// Banner de conversión al final de cada artículo del blog (reemplaza el CTA de
// texto genérico de ToolPieces): mockup real de la app + texto, generado con
// Nano Banana en la identidad visual de PeptiBrain. Una versión por idioma.
export function BlogCtaBanner({ locale }: { locale: string }) {
  const src = locale === "en" ? "/blog/cta/calc-banner-en.png" : "/blog/cta/calc-banner-es.png";
  return (
    <Link
      href="/login"
      className="mt-10 block overflow-hidden rounded-2xl shadow-sm transition-transform active:scale-[0.99]"
    >
      <Image src={src} alt="" width={1600} height={656} className="h-auto w-full" />
    </Link>
  );
}
