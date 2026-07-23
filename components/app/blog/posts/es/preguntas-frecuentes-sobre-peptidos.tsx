import { Link } from "@/i18n/navigation";
import { H2, P, Callout } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";

const FAQ_ITEMS = [
  {
    q: "¿Los péptidos son legales?",
    a: "Depende del péptido y del país. Algunos (insulina, semaglutida, tirzepatida) están aprobados como medicamentos. La mayoría de los “péptidos de investigación” no lo están y se venden con la etiqueta “solo uso en investigación”.",
  },
  {
    q: "¿Son seguros?",
    a: "No hay una respuesta única. Un péptido aprobado y prescrito por un médico tiene un perfil de seguridad conocido. Un péptido de investigación comprado por internet tiene pureza incierta y datos limitados en humanos. Siempre habla con un profesional de salud.",
  },
  {
    q: "¿Voy a tener resultados rápidos?",
    a: "Depende del objetivo. Los GLP-1 muestran cambios de peso en semanas. Los péptidos de recuperación (BPC-157, TB-500) actúan gradualmente. Los péptidos estéticos (GHK-Cu) requieren meses. No esperes transformaciones extremas.",
  },
  {
    q: "¿Necesito hacer análisis de sangre?",
    a: "Recomendado, especialmente antes y durante el uso de péptidos que afectan hormonas (GH, GLP-1, tiroides). Un panel básico + glucosa/HbA1c + perfil hepático es un buen punto de partida.",
  },
  {
    q: "¿Puedo combinar varios péptidos (stack)?",
    a: "Sí, y de hecho muchos protocolos combinan péptidos con funciones complementarias (ej. BPC-157 + TB-500 para recuperación). Empieza siempre con uno a la vez para conocer tu respuesta antes de sumar.",
  },
  {
    q: "¿Se administran solo con inyección?",
    a: "La mayoría sí, porque el estómago degrada los péptidos. Existen versiones orales, nasales o tópicas para algunos (BPC-157 oral, PT-141 nasal, GHK-Cu tópico), pero la subcutánea es la vía más común.",
  },
  {
    q: "¿Cuánto duran los efectos al parar?",
    a: "Depende. Los efectos metabólicos de los GLP-1 revierten en semanas si no hay cambios de hábitos. Los efectos regenerativos de BPC-157 en un tejido ya reparado se mantienen. Los estéticos requieren mantenimiento.",
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

      <P>Las dudas que aparecen una y otra vez, respondidas de forma clara y sin promesas exageradas.</P>

      {FAQ_ITEMS.map((item) => (
        <div key={item.q}>
          <H2>{item.q}</H2>
          <P>{item.a}</P>
        </div>
      ))}

      <Callout>
        Esta guía es educativa, no consejo médico. Antes de empezar, cambiar o detener cualquier péptido, habla con
        un profesional de la salud.
      </Callout>

      <H2>¿Y ahora qué?</H2>
      <P>
        Si todavía no tienes claro por dónde empezar, nuestra{" "}
        <Link href="/blog/que-son-los-peptidos" className="font-semibold text-primary underline underline-offset-2">
          guía básica de péptidos
        </Link>{" "}
        es un buen punto de partida. Y si ya sabes cuál te interesa, en{" "}
        <Link href="/protocolos" className="font-semibold text-primary underline underline-offset-2">
          protocolos de referencia
        </Link>{" "}
        encuentras dosis y frecuencia típicas, con acceso directo a la calculadora.
      </P>
    </>
  );
}
