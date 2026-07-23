import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        En vez de repasar péptido por péptido, muchas veces es más útil partir al revés: ¿cuál es tu objetivo?
        Aquí los organizamos por lo que la gente busca más a menudo.
      </P>

      <H2>Quiero bajar de peso</H2>
      <P>La categoría con más demanda, con diferencia. Los más mencionados:</P>
      <UL>
        <LI><strong>Semaglutida</strong> — agonista GLP-1, reduce el apetito y retrasa el vaciamiento gástrico.</LI>
        <LI><strong>Tirzepatida</strong> — agonista dual GIP/GLP-1, mismo objetivo con un mecanismo algo distinto.</LI>
        <LI><strong>Retatrutida</strong> — agonista triple, en investigación para control de peso.</LI>
      </UL>
      <P>
        Si vas por este camino, lee nuestra guía de{" "}
        <Link href="/blog/semaglutida-como-funciona-y-como-se-calcula-la-dosis" className="font-semibold text-primary underline underline-offset-2">
          semaglutida y cómo se calcula la dosis
        </Link>
        .
      </P>

      <H2>Me estoy recuperando de una lesión</H2>
      <UL>
        <LI><strong>BPC-157</strong> — el más mencionado en reparación tisular y salud digestiva.</LI>
        <LI><strong>TB-500</strong> — asociado a cicatrización, regeneración celular y movilidad.</LI>
      </UL>
      <P>
        Profundizamos en el primero en{" "}
        <Link href="/blog/bpc-157-que-es-y-para-que-se-usa" className="font-semibold text-primary underline underline-offset-2">
          este artículo sobre BPC-157
        </Link>
        .
      </P>

      <H2>Quiero ganar músculo</H2>
      <UL>
        <LI><strong>Ipamorelina</strong> — secretagogo de GH con un perfil de efectos secundarios más suave.</LI>
        <LI><strong>CJC-1295</strong> — de acción prolongada, suele combinarse con la anterior.</LI>
        <LI><strong>MK-677</strong> — la única opción de esta lista activa por vía oral.</LI>
      </UL>

      <H2>Me interesa la longevidad / antienvejecimiento</H2>
      <UL>
        <LI><strong>Epitalon</strong> — derivado de la glándula pineal, estudiado en el contexto del envejecimiento celular.</LI>
        <LI><strong>MOTS-c</strong> — de origen mitocondrial, en tendencia por su rol metabólico.</LI>
        <LI><strong>GHK-Cu</strong> — también aparece aquí por su papel en la regeneración celular.</LI>
      </UL>

      <H2>Cabello y piel</H2>
      <UL>
        <LI><strong>GHK-Cu</strong> — el más conocido, asociado a la producción de colágeno.</LI>
      </UL>
      <P>
        Le dedicamos un artículo completo:{" "}
        <Link href="/blog/ghk-cu-el-peptido-de-la-piel" className="font-semibold text-primary underline underline-offset-2">
          GHK-Cu y la piel
        </Link>
        .
      </P>

      <Callout>
        Esta guía organiza la información por objetivo con fines educativos. No implica que un péptido concreto
        sea seguro o adecuado para ti — eso lo determina un profesional de la salud.
      </Callout>

      <H2>Una vez elegido, viene la parte práctica</H2>
      <P>
        Sea cual sea tu objetivo, el paso siguiente es el mismo: calcular bien la dosis y llevar un registro. En{" "}
        <Link href="/protocolos" className="font-semibold text-primary underline underline-offset-2">
          protocolos de referencia
        </Link>{" "}
        tienes dosis y frecuencia típicas de cada péptido, con acceso directo a la calculadora.
      </P>
    </>
  );
}
