import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Convierte mg a unidades de jeringa", values: [true, false] },
  { label: "Sirve para cualquier péptido, no solo uno", values: [true, null] },
  { label: "Avisa si superas 1 jeringa U100", values: [true, false] },
  { label: "Guarda tu vial para la próxima vez", values: [true, false] },
];

const FAQ_ITEMS = [
  {
    q: "¿La fórmula es la misma para todos los péptidos?",
    a: "La conversión de mg a unidades sí es la misma fórmula para cualquier péptido reconstituido en polvo. Lo que cambia entre compuestos es la dosis y el esquema (algunos suben poco a poco, como GLP-1; otros se mantienen fijos). Los que ya vienen disueltos en aceite, como la testosterona (TRT), no se reconstituyen — solo se calcula la concentración fija del vial.",
  },
  {
    q: "¿Qué pasa si me equivoco con el agua que le puse al vial?",
    a: "Cambia la concentración, y con ella las unidades que corresponden a tu dosis — aunque la dosis en mg sea la correcta. Por eso conviene anotar exactamente cuánta agua usaste la primera vez y ser consistente cada vez que reconstituyas ese mismo péptido.",
  },
  {
    q: "¿Puedo calcular esto sin una calculadora?",
    a: "Sí, la fórmula son solo dos divisiones y una multiplicación — pero repetirla a mano cada vez que cambias de vial o de fase es donde se cuelan la mayoría de los errores. Una calculadora hace esa cuenta por ti y avisa si el resultado no es realista.",
  },
  {
    q: "¿Esto me dice qué dosis debo usar?",
    a: "No. La calculadora y esta guía convierten una dosis que ya tienes (indicada por tu médico o por el protocolo que sigues) a unidades de jeringa — no deciden ni sugieren cuánto deberías inyectarte.",
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
        Si buscaste &ldquo;cómo calcular la dosis de un péptido&rdquo; es porque tienes una dosis en miligramos
        (la que te indicó tu médico o la que trae el protocolo que sigues) y necesitas convertirla a algo que
        puedas realmente cargar en una jeringa: unidades. La fórmula es la misma para cualquier péptido
        reconstituido en polvo, sea cual sea.
      </P>

      <Summary>
        Para calcular la dosis de un péptido: (1) halla la concentración de tu vial (mg del vial ÷ mL de agua
        bacteriostática añadida), (2) divide tu dosis en mg entre esa concentración, y (3) multiplica por 100
        para obtener las unidades en una jeringa U100. Cambia el vial o el agua, y hay que rehacer la cuenta —
        aunque el compuesto y la dosis sean los mismos.
      </Summary>

      <H2>La fórmula, paso a paso</H2>
      <UL>
        <LI>
          <strong>1. Concentración del vial</strong> — mg totales del vial ÷ mL de agua bacteriostática que le
          añadiste. Un vial de 5 mg con 2 mL de agua queda a 2,5 mg/mL.
        </LI>
        <LI>
          <strong>2. Dosis ÷ concentración</strong> — tu dosis en mg dividida entre la concentración del paso 1
          te da el volumen en mL que necesitas.
        </LI>
        <LI>
          <strong>3. mL × 100 = unidades</strong> — en una jeringa U100, cada mL equivale a 100 unidades. Ese es
          el número que realmente ves marcado en la jeringa.
        </LI>
      </UL>

      <H3>Un ejemplo con números reales</H3>
      <P>
        Vial de 5 mg reconstituido con 2 mL de agua → concentración de 2,5 mg/mL. Si tu dosis es de 0,5 mg:
        0,5 ÷ 2,5 = 0,2 mL → 0,2 × 100 = <strong>20 unidades</strong> en una jeringa U100.
      </P>

      <Callout>
        Esta fórmula no decide tu dosis ni el esquema de titulación — eso lo indica tu médico o el protocolo
        que sigues. Lo que hace es la conversión matemática de mg a unidades, según la concentración real de tu
        vial concreto.
      </Callout>

      <H2>Por qué esto cambia según el tipo de péptido</H2>
      <P>
        No todos los compuestos se calculan igual. Los péptidos que vienen en polvo (BPC-157, GHK-Cu, GLP-1
        como semaglutida o tirzepatida) necesitan reconstitución antes de este cálculo — si aún no sabes cómo
        mezclar el vial con el agua, tenemos una{" "}
        <Link href="/blog/como-reconstituir-un-peptido" className="font-semibold text-primary underline underline-offset-2">
          guía paso a paso de reconstitución
        </Link>
        . La testosterona (TRT), en cambio, ya viene disuelta en aceite a una concentración fija — no se
        reconstituye, solo se calcula la concentración del vial tal cual viene.
      </P>

      <H2>Usa la calculadora gratuita</H2>
      <P>
        En vez de rehacer esta cuenta a mano cada vez, la{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          calculadora de reconstitución de PeptiBrain
        </Link>{" "}
        hace la conversión completa para cualquier péptido — indicas los mg del vial, el agua que añadiste y tu
        dosis, y te muestra las unidades exactas con un dibujo de la jeringa. Si tu protocolo es específicamente
        de GLP-1 (semaglutida o tirzepatida) con su tabla de titulación, usa la{" "}
        <Link href="/blog/calculadora-de-dosis-de-glp1" className="font-semibold text-primary underline underline-offset-2">
          calculadora de dosis de GLP-1
        </Link>
        ; si es TRT, la{" "}
        <Link href="/calculadora-trt" className="font-semibold text-primary underline underline-offset-2">
          calculadora de TRT
        </Link>
        .
      </P>
      <AppComparisonTable
        columns={["Calculadora", "A mano"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="Depende de la calculadora que uses — no es un estándar."
      />

      <H2>Preguntas frecuentes</H2>
      <UL>
        {FAQ_ITEMS.map((item) => (
          <LI key={item.q}>
            <strong>{item.q}</strong> — {item.a}
          </LI>
        ))}
      </UL>

      <P>
        Si ya calculaste tu dosis y quieres llevar el registro de cada aplicación,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        guarda cada inyección y tu historial completo en un solo lugar.
      </P>
    </>
  );
}
