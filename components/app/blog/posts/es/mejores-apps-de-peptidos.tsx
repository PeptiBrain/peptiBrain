import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_COLUMNS = ["PeptiBrain", "Peptide Tracker", "PeptIQ", "PepCalc / PeptideCalc", "Dose Track"];

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Interfaz en español real", values: [true, false, false, null, null] },
  { label: "Calculadora de reconstitución", values: [true, true, null, true, true] },
  { label: "Registro de dosis (historial)", values: [true, true, true, false, null] },
  { label: "Control de vial (caducidad)", values: [true, null, null, null, null] },
  { label: "Plan familiar", values: [true, null, null, null, null] },
  { label: "Asistente con IA", values: [true, null, null, null, null] },
];

export default function Post() {
  return (
    <>
      <P>
        Si llevas más de un péptido a la vez, tarde o temprano el cuaderno o las notas del móvil se quedan
        cortos. Repasamos las apps más usadas hoy para calcular dosis y llevar el seguimiento de un protocolo de
        péptidos — con honestidad, incluyendo dónde encaja PeptiBrain y dónde no.
      </P>

      <AppComparisonTable
        columns={COMPARISON_COLUMNS}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="No especificado por la propia app o no lo pudimos confirmar — no lo inventamos."
      />

      <H2>Qué debería tener una buena app de péptidos</H2>
      <UL>
        <LI><strong>Calculadora de reconstitución</strong> — que convierta mg + agua + dosis en unidades de jeringa.</LI>
        <LI><strong>Registro de dosis</strong> — un historial real, no solo un recordatorio puntual.</LI>
        <LI><strong>Control de vial</strong> — cuánto queda y cuándo caduca.</LI>
        <LI><strong>Idioma</strong> — si tu comunidad es hispanohablante, que la interfaz esté en español de verdad, no traducida a medias.</LI>
      </UL>

      <H2>Las apps más usadas</H2>

      <H3>Peptide Tracker</H3>
      <P>
        Una de las apps de seguimiento más establecidas del sector, gratuita, disponible en iOS y Android.
        Combina tracker y calculadora en inglés, con buena cobertura de funciones básicas.
      </P>

      <H3>PeptIQ</H3>
      <P>
        Va un paso más allá del tracking puro: añade contenido educativo sobre cada péptido (mecanismo, vida
        media, efectos). Disponible en iOS, Android y web, también en inglés.
      </P>

      <H3>PepCalc / PeptideCalc</H3>
      <P>
        Dos apps centradas específicamente en la calculadora de reconstitución, sin necesidad de registro. Buena
        opción si solo necesitas calcular, sin llevar un registro completo del protocolo.
      </P>

      <H3>Dose Track</H3>
      <P>
        Pone el foco en la privacidad (cálculo on-device) y cubre un catálogo amplio de compuestos, con un motor
        de cálculo más avanzado que el resto.
      </P>

      <H3>PeptiBrain</H3>
      <P>
        Aquí somos parte interesada, así que lo decimos con la mayor honestidad posible: nuestra diferencia
        principal frente a la mayoría de esta lista es que estamos <strong>en español</strong> (además de
        inglés) — casi ninguna de las apps anteriores lo está, y es el hueco que intentamos cubrir. Además de la
        calculadora de reconstitución y de semaglutida/tirzepatida gratuitas, PeptiBrain añade registro de dosis,
        control de caducidad de vial, un plan familiar para compartir el seguimiento, y un asistente con IA para
        dudas generales (que no da consejo médico).
      </P>

      <Callout>
        Ninguna de estas apps sustituye a un profesional de la salud. Todas, PeptiBrain incluida, son
        herramientas de organización y cálculo — no de diagnóstico ni de prescripción.
      </Callout>

      <H2>¿Cuál elegir?</H2>
      <P>
        Si solo necesitas calcular una reconstitución puntual, una calculadora suelta (PepCalc, PeptideCalc) es
        suficiente. Si llevas varios péptidos a la vez, quieres historial, control de vial y estás cómodo en
        español, esa combinación es la que buscamos ofrecer con PeptiBrain.
      </P>
      <P>
        Puedes probar nuestras calculadoras{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          gratis y sin registro
        </Link>{" "}
        antes de decidir si quieres dar el paso a la app completa.
      </P>
    </>
  );
}
