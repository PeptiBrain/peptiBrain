import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Calculadora automática de dosis", values: [false, false, true] },
  { label: "Recordatorio de próxima aplicación", values: [false, null, true] },
  { label: "Control de caducidad del vial", values: [false, false, true] },
  { label: "Historial buscable con el tiempo", values: [false, true, true] },
  { label: "Informe listo para tu médico", values: [false, false, true] },
  { label: "Sin instalar nada", values: [true, true, null] },
];

const FAQ_ITEMS = [
  {
    q: "¿Una hoja de cálculo no es suficiente?",
    a: "Para uno o dos péptidos con dosis fija, puede alcanzar. El problema aparece con la titulación (la dosis cambia cada pocas semanas), con más de un compuesto a la vez, o cuando necesitas un informe ordenado para tu médico — ahí la hoja de cálculo se vuelve trabajo manual constante.",
  },
  {
    q: "¿Qué diferencia hay entre esto y comparar apps específicas de péptidos?",
    a: "Esta guía compara categorías de herramientas (notas, hoja de cálculo, app dedicada). Si ya decidiste que quieres una app hecha para esto y quieres ver cuál elegir, tenemos una comparativa específica entre las apps más usadas.",
  },
  {
    q: "¿Puedo empezar con notas y cambiar después?",
    a: "Sí, es habitual. Muchos empiezan con notas sueltas las primeras semanas y migran a una herramienta dedicada cuando el protocolo se complica (más compuestos, titulación, o necesidad de compartir el seguimiento con la pareja o el médico).",
  },
];

export default function Post() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <P>
        Antes de decidir qué app de péptidos usar, vale la pena dar un paso atrás: ¿de verdad necesitas una
        app, o te alcanza con lo que ya tienes? Comparamos las tres formas más comunes de llevar el registro —
        notas sueltas, una hoja de cálculo armada a mano, y una herramienta dedicada — con honestidad sobre
        cuándo cada una se queda corta.
      </P>

      <Summary>
        Las notas y las hojas de cálculo funcionan bien al principio, con un solo péptido y dosis fija. Se
        quedan cortas en cuanto hay titulación (la dosis sube cada pocas semanas), más de un compuesto a la
        vez, o necesitas un informe ordenado para tu médico — ahí es donde una herramienta dedicada, con
        calculadora y recordatorios integrados, ahorra tiempo real.
      </Summary>

      <H2>Notas sueltas en el móvil</H2>
      <P>
        Lo más rápido para empezar — no necesitas instalar nada ni pensar cómo organizarlo. El problema:
        no calcula nada por ti (cada dosis la haces a mano), no avisa cuándo toca la próxima aplicación, y
        cuando pasan las semanas se vuelve difícil encontrar qué pusiste tal día.
      </P>

      <H2>Hoja de cálculo (Excel o Google Sheets)</H2>
      <P>
        Un paso más estructurado — puedes armar tus propias columnas de fecha, dosis y notas. Pero la tienes
        que construir tú mismo desde cero, no calcula automáticamente las unidades de jeringa según la
        concentración de tu vial, y no te avisa de nada — depende enteramente de que te acuerdes de abrirla.
      </P>

      <H2>Una herramienta dedicada de seguimiento</H2>
      <P>
        La diferencia real está en lo que hace por ti sin que se lo pidas: calcula la conversión de mg a
        unidades de jeringa automáticamente, te recuerda la próxima dosis, avisa cuándo se acaba un vial, y
        arma un historial que puedes llevar directo a tu cita médica.
      </P>

      <AppComparisonTable
        columns={["Notas sueltas", "Hoja de cálculo", "App dedicada"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="Depende de cómo la construyas tú mismo — no viene incluido de fábrica."
      />

      <H2>¿Cuál te conviene?</H2>
      <UL>
        <LI>
          <strong>Un solo péptido, dosis fija, protocolo corto</strong> — notas sueltas o una hoja de cálculo
          simple pueden alcanzarte perfectamente.
        </LI>
        <LI>
          <strong>Titulación (la dosis sube cada pocas semanas)</strong> — una herramienta con calculadora
          integrada te ahorra rehacer la cuenta a mano en cada fase.
        </LI>
        <LI>
          <strong>Más de un compuesto a la vez, o protocolo largo</strong> — un historial buscable y un
          informe para el médico dejan de ser un lujo y pasan a ser lo que realmente necesitas.
        </LI>
      </UL>

      <Callout>
        Ninguna de estas opciones decide tu dosis por ti — eso siempre lo indica y supervisa tu médico. La
        diferencia entre ellas es solo cuánto trabajo manual te ahorran para organizar lo que ya decidiste.
      </Callout>

      <H2>Preguntas frecuentes</H2>
      <UL>
        {FAQ_ITEMS.map((item) => (
          <LI key={item.q}>
            <strong>{item.q}</strong> — {item.a}
          </LI>
        ))}
      </UL>

      <P>
        Si ya decidiste que quieres una app hecha específicamente para péptidos, tenemos una{" "}
        <Link href="/blog/mejores-apps-de-peptidos" className="font-semibold text-primary underline underline-offset-2">
          comparativa entre las más usadas
        </Link>
        , incluyendo dónde encaja{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        y dónde no.
      </P>
    </>
  );
}
