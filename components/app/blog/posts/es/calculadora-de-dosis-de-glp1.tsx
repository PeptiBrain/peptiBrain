import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary, Sources } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Convierte mg a unidades de jeringa automáticamente", values: [true, false] },
  { label: "Incluye la tabla de titulación semanal completa", values: [true, false] },
  { label: "Avisa si la dosis supera 1 jeringa U100", values: [true, false] },
  { label: "Sirve para semaglutida y tirzepatida", values: [true, false] },
  { label: "Gratis y sin crear una cuenta", values: [true, null] },
];

const FAQ_ITEMS = [
  {
    q: "¿Qué es un medicamento GLP-1?",
    a: "GLP-1 es la familia de medicamentos (semaglutida, tirzepatida, entre otros) que imitan una hormona intestinal para regular el apetito y el azúcar en sangre. Se conocen también por sus nombres comerciales: Ozempic, Wegovy (semaglutida) y Mounjaro, Zepbound (tirzepatida).",
  },
  {
    q: "¿Esta calculadora de dosis de GLP-1 es gratis?",
    a: "Sí, es gratuita y no exige crear una cuenta para usarla.",
  },
  {
    q: "¿Necesito receta para calcular mi dosis?",
    a: "La calculadora no exige ni verifica una receta — es una herramienta de conversión matemática (mg a unidades), no de dispensación. Cualquier tratamiento con GLP-1 debe llevarse bajo supervisión médica.",
  },
  {
    q: "¿Sirve para Ozempic, Wegovy, Mounjaro o Zepbound?",
    a: "Sí. La calculadora trabaja con el compuesto (semaglutida o tirzepatida), que es el mismo principio activo detrás de esas marcas comerciales.",
  },
  {
    q: "¿Puedo guardar el registro de las dosis que ya calculé?",
    a: "La calculadora en sí no guarda historial — es de un solo uso. Si quieres llevar el registro de cada dosis aplicada junto con tu fase de titulación, PeptiBrain te permite guardarlo todo en un solo lugar.",
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
        Si buscaste &ldquo;calculadora de dosis de GLP-1&rdquo; es porque necesitas convertir la dosis en
        miligramos de tu semaglutida o tirzepatida a algo que realmente puedas cargar en una jeringa: unidades.
        Y como la dosis de GLP-1 sube cada pocas semanas (titulación), esa cuenta no se hace una sola vez —
        hay que rehacerla en cada fase.
      </P>

      <Summary>
        Una calculadora de dosis de GLP-1 convierte tu dosis semanal en miligramos a las unidades exactas de
        una jeringa U100, según la concentración real de tu vial (mg del vial ÷ mL de agua bacteriostática
        añadida). PeptiBrain tiene una gratuita, sin registro, para semaglutida y tirzepatida — con la tabla
        completa de titulación incluida.
      </Summary>

      <H2>¿Qué es un medicamento GLP-1?</H2>
      <P>
        GLP-1 (por el péptido similar al glucagón tipo 1, una hormona que el propio cuerpo produce) es la
        familia de medicamentos que incluye la semaglutida y la tirzepatida — conocidas comercialmente como
        Ozempic, Wegovy, Mounjaro y Zepbound. Actúan regulando el apetito y el azúcar en sangre, y se aplican
        una vez por semana mediante inyección subcutánea.
      </P>

      <H2>Por qué la dosis de GLP-1 no es un número fijo</H2>
      <P>
        Estos medicamentos no se empiezan en la dosis final — se suben poco a poco durante varias semanas
        (titulación), lo que reduce los efectos secundarios digestivos que pueden aparecer al principio. Eso
        significa que la dosis en miligramos cambia cada mes, y con ella, las unidades que corresponde cargar
        en la jeringa. Repetir esa conversión a mano en cada fase es donde se cuelan la mayoría de los errores.
      </P>

      <H3>De miligramos a unidades: la cuenta exacta</H3>
      <P>
        La concentración de tu vial es los miligramos totales dividido entre el agua bacteriostática que le
        añadiste. Con esa concentración, las unidades a cargar son tu dosis en mg dividida entre la
        concentración, multiplicado por 100 (la escala de una jeringa U100). Cambia el vial o la cantidad de
        agua, y la concentración cambia — aunque sea el mismo compuesto y la misma fase de titulación.
      </P>

      <Callout>
        La calculadora no decide tu dosis ni en qué fase de titulación estás — eso lo indica y supervisa tu
        médico. Lo que hace es la conversión matemática de mg a unidades de jeringa, según la concentración
        real de tu vial concreto.
      </Callout>

      <H2>Usa la calculadora gratuita de dosis de GLP-1</H2>
      <P>
        Elige el compuesto (semaglutida o tirzepatida), indica los mg de tu vial y el agua bacteriostática que
        añadiste, y la{" "}
        <Link href="/calculadora-semaglutida" className="font-semibold text-primary underline underline-offset-2">
          calculadora de GLP-1 de PeptiBrain
        </Link>{" "}
        te muestra la tabla completa de titulación semanal con las unidades exactas a cargar en cada fase —
        con un aviso si superas la capacidad de una jeringa U100.
      </P>
      <AppComparisonTable
        columns={["Calculadora GLP-1", "A mano"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="Depende de la calculadora o la hoja que uses — no es un estándar."
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
        Si ya empezaste tu tratamiento y quieres llevar el registro de cada dosis aplicada junto con tu fase
        de titulación,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        te permite guardar cada inyección y ver tu historial completo en un solo lugar.
      </P>

      <Sources
        label="Fuentes"
        items={[
          {
            title: "Tirzepatide Once Weekly for the Treatment of Obesity — SURMOUNT-1 (New England Journal of Medicine)",
            url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038",
          },
          {
            title: "Two-year effects of semaglutide in adults with overweight or obesity — STEP 5 trial",
            url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9556320/",
          },
        ]}
      />
    </>
  );
}
