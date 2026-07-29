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
  HelpCircle,
  CalendarCheck,
  Activity,
  GitCompareArrows,
  Shuffle,
  Clock,
  Coins,
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
  {
    slug: "preguntas-frecuentes-sobre-peptidos",
    title: {
      es: "FAQ: péptidos sin rodeos",
      en: "FAQ: peptides, no beating around the bush",
    },
    excerpt: {
      es: "Las dudas que aparecen una y otra vez, respondidas de forma clara y sin promesas exageradas.",
      en: "The questions that keep coming up, answered clearly and without overselling anything.",
    },
    category: { es: "Preguntas frecuentes", en: "FAQ" },
    icon: HelpCircle,
    publishedAt: "2026-08-04",
    readingMinutes: 10,
  },
  {
    slug: "como-registrar-tus-dosis-de-glp1",
    title: {
      es: "Cómo registrar tus dosis de GLP-1 correctamente: guía paso a paso",
      en: "How to track your GLP-1 doses correctly: a step-by-step guide",
    },
    excerpt: {
      es: "Qué anotar en cada dosis, cómo hacerlo desde el primer día y qué mirar en tu registro semanas después — la guía que nos hubiera gustado tener al empezar.",
      en: "What to log with every dose, how to start from day one, and what to look for in your log weeks later — the guide we wish we'd had when starting.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: CalendarCheck,
    publishedAt: "2026-08-05",
    readingMinutes: 7,
  },
  {
    slug: "como-registrar-tus-dosis-de-trt",
    title: {
      es: "Cómo registrar tus dosis de TRT correctamente: guía paso a paso",
      en: "How to track your TRT doses correctly: a step-by-step guide",
    },
    excerpt: {
      es: "Qué anotar en cada inyección de testosterona, cómo calcular el volumen exacto y qué mirar en tu registro antes de cada análisis de sangre.",
      en: "What to log with every testosterone injection, how to calculate the exact volume, and what to look for in your log before each blood test.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: Activity,
    publishedAt: "2026-08-06",
    readingMinutes: 7,
  },
  {
    slug: "compatibilidad-de-stacks-como-usarla",
    title: {
      es: "Compatibilidad de stacks: cómo funciona la herramienta y cómo sacarle el máximo partido",
      en: "Stack compatibility: how the tool works and how to get the most out of it",
    },
    excerpt: {
      es: "Qué significan los 4 estados (estudiado, precaución, evitar, sin datos), ejemplos reales de combos consultados y cómo usarla si llevas varios péptidos a la vez.",
      en: "What the 4 statuses mean (studied, caution, avoid, no data), real examples of checked combos, and how to use it if you're running several peptides at once.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: GitCompareArrows,
    publishedAt: "2026-08-07",
    readingMinutes: 6,
  },
  {
    slug: "calculadora-de-reconstitucion-como-usarla",
    title: {
      es: "Calculadora de reconstitución: cómo funciona y cómo sacarle el máximo partido",
      en: "Reconstitution calculator: how it works and how to get the most out of it",
    },
    excerpt: {
      es: "Cómo pasar de mg y agua bacteriostática a unidades exactas de jeringa (U30, U50, U100), con jeringa visual y PDF — la aritmética explicada sin dosis personalizadas.",
      en: "How to go from mg and bacteriostatic water to exact syringe units (U30, U50, U100), with a visual syringe and PDF — the math explained without personalized dosing.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: Beaker,
    publishedAt: "2026-08-08",
    readingMinutes: 6,
  },
  {
    slug: "calculadora-de-semaglutida-como-usarla",
    title: {
      es: "Calculadora de semaglutida y tirzepatida: cómo funciona y cómo sacarle el máximo partido",
      en: "Semaglutide & tirzepatide calculator: how it works and how to get the most out of it",
    },
    excerpt: {
      es: "La tabla completa de titulación semanal explicada: por qué existe, qué esquema de referencia usa y cómo convertir cada fase en unidades de jeringa.",
      en: "The full weekly titration table explained: why it exists, what reference schedule it uses, and how to convert each phase into syringe units.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: Syringe,
    publishedAt: "2026-08-09",
    readingMinutes: 7,
  },
  {
    slug: "comparador-de-peptidos-como-usarlo",
    title: {
      es: "Comparador de péptidos: cómo funciona y cómo sacarle el máximo partido",
      en: "Peptide comparator: how it works and how to get the most out of it",
    },
    excerpt: {
      es: "Qué campos compara lado a lado (vía, dosis, frecuencia, evidencia, combina/evita) y cómo usarlo para entender diferencias, no para elegir por ti.",
      en: "What fields it compares side by side (route, dose, frequency, evidence, combines/avoid) and how to use it to understand differences, not to choose for you.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: Shuffle,
    publishedAt: "2026-08-10",
    readingMinutes: 6,
  },
  {
    slug: "calculadora-de-eliminacion-como-usarla",
    title: {
      es: "Calculadora de eliminación: cómo funciona y cómo sacarle el máximo partido",
      en: "Clearance calculator: how it works and how to get the most out of it",
    },
    excerpt: {
      es: "Por qué se usa la regla de 5 vidas medias (~97% eliminado), por qué no aparecen todos los péptidos y cómo leer el resultado con criterio.",
      en: "Why the 5-half-lives rule (~97% eliminated) is used, why not every peptide appears, and how to read the result with judgment.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: Clock,
    publishedAt: "2026-08-11",
    readingMinutes: 6,
  },
  {
    slug: "calculadora-de-costo-por-mg-como-usarla",
    title: {
      es: "Calculadora de costo por mg: cómo funciona y cómo sacarle el máximo partido",
      en: "Cost-per-mg calculator: how it works and how to get the most out of it",
    },
    excerpt: {
      es: "Cómo comparar de verdad el costo entre proveedores y tamaños de vial: precio ÷ contenido, y por qué el costo por dosis es el número que importa.",
      en: "How to really compare cost across suppliers and vial sizes: price ÷ content, and why cost per dose is the number that matters.",
    },
    category: { es: "Guía práctica", en: "Practical guide" },
    icon: Coins,
    publishedAt: "2026-08-12",
    readingMinutes: 6,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

// Slugs que ya tienen una imagen de portada real en public/blog/<slug>.png
// (si se agrega un artículo nuevo sin imagen, cae solo al icono + degradado de ArticleHero).
const SLUGS_WITH_IMAGE = new Set([
  "que-son-los-peptidos",
  "como-reconstituir-un-peptido",
  "semaglutida-como-funciona-y-como-se-calcula-la-dosis",
  "bpc-157-que-es-y-para-que-se-usa",
  "ghk-cu-el-peptido-de-la-piel",
  "errores-comunes-al-empezar-con-peptidos",
  "mejores-apps-de-peptidos",
  "peptidos-populares",
  "peptidos-segun-tu-objetivo",
  "como-se-usan-los-peptidos",
  "como-almacenar-tus-peptidos",
  "preguntas-frecuentes-sobre-peptidos",
  "como-registrar-tus-dosis-de-glp1",
]);

export function getPostImagePath(slug: string): string | null {
  return SLUGS_WITH_IMAGE.has(slug) ? `/blog/${slug}.png` : null;
}
