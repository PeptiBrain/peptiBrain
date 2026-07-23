import {
  Beaker,
  Syringe,
  Sparkles,
  Dumbbell,
  ListChecks,
  AlertTriangle,
  BookOpen,
  LayoutGrid,
  Target,
  MapPin,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  icon: LucideIcon;
  publishedAt: string; // ISO yyyy-mm-dd
  readingMinutes: number;
};

// Blog en español (por ahora) — 7 artículos de arranque, cubriendo los 3 pilares
// de demanda (adelgazar, recuperación, piel/antiedad) + guía básica + comparativa
// + errores comunes + reconstitución. Contenido educativo, no consejo médico.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "que-son-los-peptidos",
    title: "¿Qué son los péptidos? Guía básica para empezar",
    excerpt: "Una introducción clara a qué son los péptidos, cómo actúan en el cuerpo y por qué se han vuelto tan populares en la comunidad de bienestar.",
    category: "Guía básica",
    icon: BookOpen,
    publishedAt: "2026-07-24",
    readingMinutes: 6,
  },
  {
    slug: "como-reconstituir-un-peptido",
    title: "Cómo reconstituir un péptido paso a paso (agua bacteriostática)",
    excerpt: "La reconstitución explicada sin tecnicismos: qué es el agua bacteriostática, cuánta usar y cómo calcular la concentración de tu vial.",
    category: "Guía práctica",
    icon: Beaker,
    publishedAt: "2026-07-25",
    readingMinutes: 7,
  },
  {
    slug: "semaglutida-como-funciona-y-como-se-calcula-la-dosis",
    title: "Semaglutida: cómo funciona y cómo se calcula la dosis",
    excerpt: "Qué es la semaglutida, por qué se sube la dosis poco a poco (titulación) y cómo pasar de miligramos a unidades de jeringa sin errores.",
    category: "Pérdida de peso",
    icon: Syringe,
    publishedAt: "2026-07-26",
    readingMinutes: 8,
  },
  {
    slug: "bpc-157-que-es-y-para-que-se-usa",
    title: "BPC-157: qué es y para qué se investiga en recuperación",
    excerpt: "Un repaso a uno de los péptidos más mencionados en recuperación de tejidos y lesiones: qué dice la investigación y qué no.",
    category: "Recuperación",
    icon: Dumbbell,
    publishedAt: "2026-07-27",
    readingMinutes: 6,
  },
  {
    slug: "ghk-cu-el-peptido-de-la-piel",
    title: "GHK-Cu: el péptido de cobre y la piel — qué dice la ciencia",
    excerpt: "Por qué el GHK-Cu se ha vuelto tan popular en cuidado de la piel y qué papel juega el cobre en la regeneración cutánea.",
    category: "Piel y antiedad",
    icon: Sparkles,
    publishedAt: "2026-07-28",
    readingMinutes: 6,
  },
  {
    slug: "errores-comunes-al-empezar-con-peptidos",
    title: "7 errores comunes al empezar con péptidos (y cómo evitarlos)",
    excerpt: "Los fallos más habituales al iniciar un protocolo: desde calcular mal el agua hasta no llevar ningún registro de las dosis.",
    category: "Guía práctica",
    icon: AlertTriangle,
    publishedAt: "2026-07-29",
    readingMinutes: 7,
  },
  {
    slug: "mejores-apps-de-peptidos",
    title: "Las mejores apps de péptidos en 2026 (comparativa)",
    excerpt: "Comparamos las apps más usadas para calcular dosis y llevar el seguimiento de péptidos: idioma, precio, calculadoras y plan familiar.",
    category: "Comparativa",
    icon: ListChecks,
    publishedAt: "2026-07-30",
    readingMinutes: 8,
  },
  {
    slug: "peptidos-populares",
    title: "Péptidos populares: los más mencionados y qué se investiga de cada uno",
    excerpt: "Un repaso a los péptidos más buscados hoy — de dónde vienen, en qué categoría entran y qué se investiga de cada uno.",
    category: "Directorio",
    icon: LayoutGrid,
    publishedAt: "2026-07-31",
    readingMinutes: 7,
  },
  {
    slug: "peptidos-segun-tu-objetivo",
    title: "Péptidos según tu objetivo: peso, recuperación, músculo, antiedad y piel",
    excerpt: "Organizados por lo que buscas: bajar de peso, recuperarte de una lesión, ganar músculo, cuidar tu piel o la longevidad.",
    category: "Guía por objetivo",
    icon: Target,
    publishedAt: "2026-08-01",
    readingMinutes: 8,
  },
  {
    slug: "como-se-usan-los-peptidos",
    title: "Cómo se usan los péptidos: vía, horario y rotación de zonas",
    excerpt: "La parte práctica que casi nadie explica bien: por dónde se inyectan, cada cuánto y cómo rotar la zona para no irritar la piel.",
    category: "Guía práctica",
    icon: MapPin,
    publishedAt: "2026-08-02",
    readingMinutes: 6,
  },
  {
    slug: "como-almacenar-tus-peptidos",
    title: "Cómo almacenar tus péptidos: temperatura, luz y vida útil",
    excerpt: "Antes y después de reconstituir: dónde guardar cada vial, por qué la luz y el calor son el enemigo, y cuánto dura de verdad.",
    category: "Guía práctica",
    icon: Snowflake,
    publishedAt: "2026-08-03",
    readingMinutes: 6,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
