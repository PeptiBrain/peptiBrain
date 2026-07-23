import { Link } from "@/i18n/navigation";
import { H2, H3, P, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Si empiezas a investigar sobre péptidos, enseguida aparecen los mismos nombres una y otra vez. Aquí tienes
        un repaso rápido a los más mencionados, organizados por lo que más se investiga de cada uno.
      </P>

      <H2>Pérdida de peso</H2>
      <H3>Semaglutida</H3>
      <P>
        Agonista del receptor GLP-1. Reduce el apetito, retrasa el vaciamiento gástrico y mejora la sensibilidad
        a la insulina. El más buscado con diferencia de toda esta lista.
      </P>
      <H3>Tirzepatida</H3>
      <P>Agonista dual GIP/GLP-1. Apoya el control de peso y mejora la sensibilidad a la insulina.</P>
      <H3>Retatrutida</H3>
      <P>Agonista triple GIP/GLP-1/glucagón, en investigación para control de peso.</P>

      <H2>Recuperación y tejidos</H2>
      <H3>BPC-157</H3>
      <P>
        Pentadecapéptido derivado de una proteína gástrica. Conocido por sus propiedades de reparación tisular y
        salud digestiva.
      </P>
      <H3>TB-500</H3>
      <P>Fragmento sintético de la timosina beta-4. Promueve la cicatrización, regeneración celular y movilidad.</P>

      <H2>Músculo y hormona de crecimiento</H2>
      <H3>Ipamorelina</H3>
      <P>Secretagogo selectivo de hormona de crecimiento, con un perfil de efectos secundarios más suave que otros.</P>
      <H3>CJC-1295</H3>
      <P>Análogo de acción prolongada de la hormona liberadora de GH. Suele combinarse con ipamorelina.</P>
      <H3>MK-677 (Ibutamoren)</H3>
      <P>Secretagogo no peptídico de GH activo por vía oral. Imita la acción de la grelina.</P>

      <H2>Longevidad y antienvejecimiento</H2>
      <H3>Epitalon</H3>
      <P>Péptido sintético derivado de la glándula pineal. Estudiado por su posible relación con el envejecimiento celular.</P>
      <H3>MOTS-c</H3>
      <P>Péptido derivado de la mitocondria. En tendencia por su posible rol en el metabolismo.</P>

      <H2>Piel y belleza</H2>
      <H3>GHK-Cu</H3>
      <P>
        Complejo péptido-cobre presente naturalmente en el cuerpo. Muy usado en cosmética por su asociación con
        la producción de colágeno.
      </P>

      <Callout>
        Esta es una lista informativa de los péptidos más mencionados, no una recomendación de uso. Muchos siguen
        en fase de investigación y su uso debe darse bajo supervisión de un profesional de la salud.
      </Callout>

      <H2>Ahora ordenados por lo que buscas</H2>
      <P>
        Si prefieres verlos organizados según tu objetivo concreto (bajar de peso, recuperación, músculo,
        antiedad o piel), tenemos una{" "}
        <Link href="/blog/peptidos-segun-tu-objetivo" className="font-semibold text-primary underline underline-offset-2">
          guía por objetivo
        </Link>
        . Y si ya tienes claro cuál usar, en{" "}
        <Link href="/protocolos" className="font-semibold text-primary underline underline-offset-2">
          nuestra guía de protocolos
        </Link>{" "}
        encuentras dosis y frecuencia de referencia para cada uno.
      </P>
    </>
  );
}
