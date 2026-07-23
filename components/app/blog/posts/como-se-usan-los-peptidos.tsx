import { Link } from "@/i18n/navigation";
import { H2, P, OL, OLItem, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Ya sabes qué es un péptido y cómo reconstituirlo. Lo que casi nadie explica bien es la parte del día a
        día: por dónde se aplica, con qué frecuencia y cómo evitar irritar siempre la misma zona.
      </P>

      <H2>La vía más habitual: subcutánea</H2>
      <P>
        La gran mayoría de péptidos en vial se aplican por vía subcutánea — es decir, en el tejido graso justo
        debajo de la piel, no en el músculo. Se usa una aguja corta y fina (la misma jeringa de insulina que ya
        usas para calcular la dosis), y es la vía que menos molestia suele generar.
      </P>

      <H2>Zonas habituales y por qué rotarlas</H2>
      <P>
        Las zonas más usadas son el abdomen (a un par de dedos del ombligo), la parte externa del muslo y, en
        menor medida, la parte de atrás del brazo. Ninguna es &ldquo;la correcta&rdquo; en exclusiva — lo importante es{" "}
        <strong>rotarlas</strong>.
      </P>
      <P>
        Aplicarse siempre en el mismo punto milimétrico puede generar endurecimiento del tejido con el tiempo
        (lo que se conoce como lipohipertrofia) y hace que esa zona absorba peor con cada nueva aplicación.
        Alternar entre 3-4 puntos distintos, separados un par de centímetros entre sí, es la práctica habitual.
      </P>

      <H2>Los 4 pasos básicos de una aplicación</H2>
      <OL>
        <OLItem n={1}>
          <strong>Lávate las manos</strong> y desinfecta la zona con un algodón con alcohol. Deja que se seque
          antes de pinchar.
        </OLItem>
        <OLItem n={2}>
          <strong>Carga la jeringa</strong> con las unidades exactas que corresponden a tu dosis (nunca a ojo).
        </OLItem>
        <OLItem n={3}>
          <strong>Pellizca suavemente la piel</strong> de la zona elegida e introduce la aguja en un ángulo de
          90°, o de 45° si tienes poca grasa subcutánea en esa zona.
        </OLItem>
        <OLItem n={4}>
          <strong>Presiona el émbolo despacio</strong>, retira la aguja y desecha en un contenedor rígido — nunca
          en la basura normal.
        </OLItem>
      </OL>

      <Callout>
        Este es un resumen general de cómo se administra un péptido subcutáneo, no una instrucción médica
        personalizada. La técnica exacta y la idoneidad de cualquier péptido debe indicarla un profesional de la
        salud.
      </Callout>

      <H2>La constancia importa más que la hora exacta</H2>
      <P>
        Para péptidos de dosis diaria (como el BPC-157), aplicarlo aproximadamente a la misma hora cada día ayuda
        a mantener un ritmo constante. Para los de dosis semanal (como la semaglutida), lo habitual es fijar un
        día de la semana y mantenerlo — cambiar de día ocasionalmente no es grave, pero perder la cuenta de
        cuándo tocó la última sí lo es.
      </P>
      <P>
        Y ahí es donde un registro te ahorra dolores de cabeza: si llevas más de un péptido a la vez, anotar
        cada aplicación (zona, fecha y dosis) es la única forma de no perder el hilo. Nuestra{" "}
        <Link href="/login" className="font-semibold text-primary underline underline-offset-2">
          app
        </Link>{" "}
        lo hace en segundos y te avisa cuándo toca la siguiente.
      </P>
    </>
  );
}
