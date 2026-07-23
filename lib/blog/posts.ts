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

type LocalizedText = { es: string; en: string };

export type BlogPost = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category: LocalizedText;
  icon: LucideIcon;
  publishedAt: string; // ISO yyyy-mm-dd
  readingMinutes: number;
};

// Devuelve el texto en el idioma pedido (con fallback a español si faltara).
export function localized(text: LocalizedText, locale: string): string {
  return locale === "en" ? text.en || text.es : text.es;
}

// Blog bilingüe (es/en) — 11 artículos, cubriendo los 3 pilares de demanda
// (adelgazar, recuperación, piel/antiedad) + guía básica + comparativa + errores
// comunes + reconstitución + directorio + objetivo + uso + almacenamiento.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "que-son-los-peptidos",
    title: {
      es: "¿Qué son los péptidos? Guía básica para empezar",
      en: "What are peptides? A basic guide to get started",
    },
    excerpt: {
      es: "Una introducción clara a qué son los péptidos, cómo actúan en el cuerpo y por qué se han vuelto tan populares en la comunidad de bienestar.",
      en: "A clear introduction to what peptides are, how they act in the body, and why they've become so popular in the wellness community.",
    },
    category: { es: "Guía básica", en: "Basic guide" },
    icon: BookOpen,
    publishedAt: "2026-07-24",
    readingMinutes: 6,
  },
  {
    slug: "como-reconstituir-un-peptido",
    title: {
      es: "Cómo reconstituir un péptido paso a paso (agua bacteriostática)",
      en: "How to reconstitute a peptide step by step (bacteriostatic water)",
    },
    excerpt: {
      es: "La reconstitución explicada sin tecnicismos: qué es el agua bacteriostática, cuánta usar y cómo calcular la concentración de tu vial.",
      en: "Reconstitution explained in plain terms: what bacteriostatic water is, how much to use, and how to calculate your vial's concentration.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: Beaker,
    publishedAt: "2026-07-25",
    readingMinutes: 7,
  },
  {
    slug: "semaglutida-como-funciona-y-como-se-calcula-la-dosis",
    title: {
      es: "Semaglutida: cómo funciona y cómo se calcula la dosis",
      en: "Semaglutide: how it works and how the dose is calculated",
    },
    excerpt: {
      es: "Qué es la semaglutida, por qué se sube la dosis poco a poco (titulación) y cómo pasar de miligramos a unidades de jeringa sin errores.",
      en: "What semaglutide is, why the dose is titrated up gradually, and how to convert milligrams into syringe units without mistakes.",
    },
    category: { es: "Pérdida de peso", en: "Weight loss" },
    icon: Syringe,
    publishedAt: "2026-07-26",
    readingMinutes: 8,
  },
  {
    slug: "bpc-157-que-es-y-para-que-se-usa",
    title: {
      es: "BPC-157: qué es y para qué se investiga en recuperación",
      en: "BPC-157: what it is and what it's researched for in recovery",
    },
    excerpt: {
      es: "Un repaso a uno de los péptidos más mencionados en recuperación de tejidos y lesiones: qué dice la investigación y qué no.",
      en: "A look at one of the most talked-about peptides in tissue repair and injury recovery: what the research says, and what it doesn't.",
    },
    category: { es: "Recuperación", en: "Recovery" },
    icon: Dumbbell,
    publishedAt: "2026-07-27",
    readingMinutes: 6,
  },
  {
    slug: "ghk-cu-el-peptido-de-la-piel",
    title: {
      es: "GHK-Cu: el péptido de cobre y la piel — qué dice la ciencia",
      en: "GHK-Cu: the copper peptide and the skin — what the science says",
    },
    excerpt: {
      es: "Por qué el GHK-Cu se ha vuelto tan popular en cuidado de la piel y qué papel juega el cobre en la regeneración cutánea.",
      en: "Why GHK-Cu has become so popular in skincare and what role copper plays in skin regeneration.",
    },
    category: { es: "Piel y antiedad", en: "Skin & anti-aging" },
    icon: Sparkles,
    publishedAt: "2026-07-28",
    readingMinutes: 6,
  },
  {
    slug: "errores-comunes-al-empezar-con-peptidos",
    title: {
      es: "7 errores comunes al empezar con péptidos (y cómo evitarlos)",
      en: "7 common mistakes when starting with peptides (and how to avoid them)",
    },
    excerpt: {
      es: "Los fallos más habituales al iniciar un protocolo: desde calcular mal el agua hasta no llevar ningún registro de las dosis.",
      en: "The most common slip-ups when starting a protocol: from miscalculating water to keeping no record of your doses at all.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: AlertTriangle,
    publishedAt: "2026-07-29",
    readingMinutes: 7,
  },
  {
    slug: "mejores-apps-de-peptidos",
    title: {
      es: "Las mejores apps de péptidos en 2026 (comparativa)",
      en: "The best peptide apps in 2026 (comparison)",
    },
    excerpt: {
      es: "Comparamos las apps más usadas para calcular dosis y llevar el seguimiento de péptidos: idioma, precio, calculadoras y plan familiar.",
      en: "We compare the most used apps for calculating doses and tracking peptides: language, price, calculators, and family plan.",
    },
    category: { es: "Comparativa", en: "Comparison" },
    icon: ListChecks,
    publishedAt: "2026-07-30",
    readingMinutes: 8,
  },
  {
    slug: "peptidos-populares",
    title: {
      es: "Péptidos populares: los más mencionados y qué se investiga de cada uno",
      en: "Popular peptides: the most mentioned ones and what's researched about each",
    },
    excerpt: {
      es: "Un repaso a los péptidos más buscados hoy — de dónde vienen, en qué categoría entran y qué se investiga de cada uno.",
      en: "A rundown of the most searched-for peptides today — where they come from, what category they fall into, and what's researched about each.",
    },
    category: { es: "Directorio", en: "Directory" },
    icon: LayoutGrid,
    publishedAt: "2026-07-31",
    readingMinutes: 7,
  },
  {
    slug: "peptidos-segun-tu-objetivo",
    title: {
      es: "Péptidos según tu objetivo: peso, recuperación, músculo, antiedad y piel",
      en: "Peptides by goal: weight, recovery, muscle, anti-aging and skin",
    },
    excerpt: {
      es: "Organizados por lo que buscas: bajar de peso, recuperarte de una lesión, ganar músculo, cuidar tu piel o la longevidad.",
      en: "Organized by what you're after: losing weight, recovering from an injury, gaining muscle, caring for your skin, or longevity.",
    },
    category: { es: "Guía por objetivo", en: "Goal-based guide" },
    icon: Target,
    publishedAt: "2026-08-01",
    readingMinutes: 8,
  },
  {
    slug: "como-se-usan-los-peptidos",
    title: {
      es: "Cómo se usan los péptidos: vía, horario y rotación de zonas",
      en: "How peptides are used: route, timing and site rotation",
    },
    excerpt: {
      es: "La parte práctica que casi nadie explica bien: por dónde se inyectan, cada cuánto y cómo rotar la zona para no irritar la piel.",
      en: "The practical part almost no one explains well: where to inject, how often, and how to rotate sites to avoid irritating the skin.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: MapPin,
    publishedAt: "2026-08-02",
    readingMinutes: 6,
  },
  {
    slug: "como-almacenar-tus-peptidos",
    title: {
      es: "Cómo almacenar tus péptidos: temperatura, luz y vida útil",
      en: "How to store your peptides: temperature, light and shelf life",
    },
    excerpt: {
      es: "Antes y después de reconstituir: dónde guardar cada vial, por qué la luz y el calor son el enemigo, y cuánto dura de verdad.",
      en: "Before and after reconstitution: where to store each vial, why light and heat are the enemy, and how long it really lasts.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: Snowflake,
    publishedAt: "2026-08-03",
    readingMinutes: 6,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
