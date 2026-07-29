import { Check, X, Calculator, LayoutGrid, TrendingUp, BookOpen, Newspaper } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Calculadora automática de dosis", values: [true, false, false] },
  { label: "Recordatorio de próxima aplicación", values: [true, false, false] },
  { label: "Control de caducidad del vial", values: [true, false, null] },
  { label: "Historial completo y buscable", values: [true, false, true] },
  { label: "Informe listo para tu médico", values: [true, false, false] },
  { label: "Compartir con tu familia", values: [true, false, null] },
  { label: "Interfaz en español real", values: [true, true, true] },
  { label: "Sin instalar nada (funciona en el navegador)", values: [true, true, null] },
];

function ProsConsColumn({
  title,
  items,
  positive,
}: {
  title: string;
  items: string[];
  positive: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        positive ? "border-primary/25 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            {positive ? (
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            ) : (
              <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" aria-hidden />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContentEs() {
  return (
    <>
      <H2>¿Por qué elegir PeptiBrain?</H2>
      <P>
        La comparación más honesta no es contra otra app — es contra lo que probablemente usas hoy: notas
        sueltas en el móvil o, como mucho, una hoja de cálculo armada a mano.
      </P>
      <AppComparisonTable
        columns={["PeptiBrain", "Notas del móvil", "Hoja de cálculo"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="Depende de cómo la construyas tú mismo — no viene incluido de fábrica."
      />

      <H2>¿Cuándo te conviene, y cuándo quizás no?</H2>
      <P>Con la misma honestidad: PeptiBrain no es para todo el mundo, y preferimos decírtelo antes de que te registres.</P>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ProsConsColumn
          title="Te conviene si..."
          positive
          items={[
            "Llevas un protocolo de péptidos, GLP-1 o TRT y quieres dejar de depender de notas sueltas.",
            "Prefieres una calculadora automática en vez de hacer cuentas a mano cada semana.",
            "Necesitas un informe ordenado para tu próxima cita médica.",
            "Quieres compartir el seguimiento con tu pareja o un familiar.",
            "Buscas una app realmente en español, no traducida a medias.",
          ]}
        />
        <ProsConsColumn
          title="Quizás no es para ti si..."
          positive={false}
          items={[
            "Buscas que la app te diga qué dosis tomar o te diagnostique — no lo hace, y no debería.",
            "No sigues actualmente ningún protocolo de péptidos, GLP-1 o TRT.",
            "Buscas comprar péptidos — PeptiBrain no vende ni distribuye nada.",
          ]}
        />
      </div>

      <H2>Ventajas concretas para ti</H2>
      <UL>
        <LI><strong>Ahorras tiempo</strong> — registrar una dosis toma segundos, no minutos haciendo cuentas.</LI>
        <LI><strong>Reduces errores</strong> — la calculadora convierte mg a unidades de jeringa por ti, según tu vial real.</LI>
        <LI><strong>Ganas constancia</strong> — la racha y los recordatorios hacen visible si te estás saltando aplicaciones.</LI>
        <LI><strong>Mejoras la conversación con tu médico</strong> — llegas con un informe, no con la memoria.</LI>
        <LI><strong>Tu privacidad está protegida</strong> — control de acceso por fila (RLS): nadie ve tu protocolo salvo que tú lo compartas.</LI>
        <LI><strong>Puedes empezar sin pagar</strong> — el plan gratuito es real (un péptido, un vial activo), no una prueba disfrazada.</LI>
      </UL>

      <H2>Nuestros principios</H2>
      <P>
        Tres reglas que no rompemos: la app organiza y calcula lo que tu protocolo ya indica, nunca decide una
        dosis por ti. El contenido del blog nunca inventa un dato, una cita o una credencial — si no podemos
        verificarlo, lo decimos así de claro. Y tus datos son tuyos: nadie los ve salvo que tú compartas el
        acceso explícitamente.
      </P>

      <H2>Cómo escribimos el contenido del blog</H2>
      <P>
        Los artículos se basan en información pública ya establecida (mecanismos conocidos, esquemas de
        titulación de referencia, reglas estándar de farmacología) y en los mismos datos de referencia que
        usan las herramientas de la app. Cuando citamos un estudio, enlazamos directo a la fuente (PubMed/DOI)
        — si no encontramos una fuente verificable, lo decimos explícitamente en vez de inventar un dato o una
        cita.
      </P>

      <Callout>
        Ningún artículo, calculadora ni respuesta del asistente de IA constituye consejo médico, diagnóstico o
        receta. El contenido es educativo — la decisión sobre qué usar, en qué dosis y bajo qué supervisión es
        siempre de tu médico.
      </Callout>

      <H2>Seguridad y privacidad de tus datos</H2>
      <P>
        Cada cuenta tiene control de acceso por fila (RLS) en la base de datos: tu protocolo, tus dosis y tu
        historial solo los ves tú, salvo que compartas el acceso explícitamente con el plan Family. No vendemos
        tus datos a terceros ni los usamos para entrenar modelos sin tu consentimiento.
      </P>

      <H2>Quién está detrás</H2>
      <P>
        PeptiBrain es un producto de Digital Dreams World LLC (2105 Vista Oeste NW Suite E 3564, Albuquerque,
        NM 87120, Estados Unidos). Hoy no contamos con un consejo médico asesor propio — si en el futuro lo
        tenemos, lo anunciaremos aquí con nombre real, no antes.
      </P>

      <H2>Explora PeptiBrain</H2>
      <P>Si quieres seguir mirando antes de decidirte, esto es lo que más te puede servir:</P>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link
          href="/herramientas"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Calculator className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Prueba las calculadoras gratis, sin registro</span>
        </Link>
        <Link
          href="/protocolos"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <LayoutGrid className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Explora la galería de péptidos y protocolos</span>
        </Link>
        <Link
          href="/blog/peptidos-populares"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <TrendingUp className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Los péptidos más buscados del momento</span>
        </Link>
        <Link
          href="/blog/que-es-peptibrain"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Lee la guía completa: ¿Qué es PeptiBrain?</span>
        </Link>
        <Link
          href="/blog"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40 sm:col-span-2"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Newspaper className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Ver todo el blog</span>
        </Link>
      </div>

      <H2>Contacto</H2>
      <P>¿Preguntas, correcciones o algo que creas que deberíamos revisar? Escríbenos a hello@peptibrain.com.</P>
    </>
  );
}
