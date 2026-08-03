import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, OL, OLItem, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Reconstituir un péptido es mezclar el polvo liofilizado del vial con agua bacteriostática para
        poder inyectarlo. El problema no es la mezcla en sí — es que, una vez mezclado, cada dosis
        depende de una cuenta que hay que acertar cada vez. Por eso construimos la{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          Calculadora de reconstitución
        </Link>
        .
      </P>

      <Summary>
        Metes los mg (o mcg) de tu vial, el agua bacteriostática que añadiste y la dosis que quieres
        aplicar, y la calculadora te devuelve las unidades exactas a cargar en tu jeringa de insulina
        (U30, U50 o U100), con un dibujo de la jeringa y un botón para imprimir o guardar en PDF. La
        dosis en sí la define tu protocolo o tu médico — la herramienta solo hace la aritmética.
      </Summary>

      <H2>Cómo funciona</H2>
      <P>
        La calculadora pide tres datos y con eso resuelve todo lo demás:
      </P>
      <OL>
        <OLItem n={1}>
          <strong>Cantidad del vial.</strong> Los mg o mcg de péptido que trae el vial (viene liofilizado,
          en polvo).
        </OLItem>
        <OLItem n={2}>
          <strong>Agua bacteriostática añadida.</strong> Cuántos mililitros de agua le pusiste al vial.
        </OLItem>
        <OLItem n={3}>
          <strong>Dosis deseada y tipo de jeringa.</strong> La dosis que quieres aplicar y si tu jeringa
          de insulina es U30, U50 o U100 (la más común).
        </OLItem>
      </OL>
      <P>
        Con esos tres datos, la calculadora te dice hasta qué unidad de la jeringa cargar, con un
        dibujo visual para que no tengas que traducir números a rayitas de la jeringa tú mismo. Si la
        dosis que pediste supera la capacidad de la jeringa elegida, te avisa en vez de darte un
        resultado imposible de cargar — y ahí tienes dos salidas: una jeringa mayor o más agua
        bacteriostática (lo que baja la concentración y sube el volumen por dosis).
      </P>

      <H3>La matemática detrás, explicada simple</H3>
      <P>
        No hace falta memorizar la fórmula, pero entenderla ayuda a confiar en el resultado. Primero,
        los mg del vial dividido entre los mL de agua que añadiste te dan la concentración (mg por mL).
        Después, tu dosis dividida entre esa concentración, multiplicada por 100, te da las unidades a
        cargar en una jeringa U100 — porque en una jeringa de insulina U100, 100 unidades equivalen a 1
        mL. Cambiar el tipo de jeringa (U30, U50) solo cambia la escala de las rayitas, no la cuenta de
        fondo.
      </P>

      <Callout>
        Un mismo vial reconstituido con más o menos agua no cambia la cantidad total de péptido que
        tienes — cambia cuántas unidades tienes que cargar para llegar a la misma dosis. Más agua = más
        diluido = más unidades por dosis (pero también más margen para medir con precisión en jeringas
        pequeñas).
      </Callout>

      <H2>Cómo sacarle el máximo partido</H2>
      <UL>
        <LI>
          <strong>Usa siempre la misma cantidad de agua para el mismo vial.</strong> Si reconstituyes
          hoy con 2 mL y la próxima vez con 3 mL &ldquo;porque ya no me acordaba&rdquo;, la concentración cambia y
          las unidades que cargabas antes ya no sirven para la misma dosis.
        </LI>
        <LI>
          <strong>Confirma el tipo de jeringa antes de leer el resultado.</strong> Las unidades de una
          U30 y una U50 se ven distinto en la propia jeringa — elegir el tipo correcto en la calculadora
          es lo que hace que el dibujo coincida con lo que tienes en la mano.
        </LI>
        <LI>
          <strong>Guarda o imprime el resultado la primera vez que reconstituyas un vial nuevo.</strong>{" "}
          El botón de imprimir/PDF existe justamente para no tener que repetir el cálculo cada semana
          mientras dure ese mismo vial.
        </LI>
        <LI>
          <strong>Si cambias de vial o de concentración, vuelve a calcular desde cero.</strong> No
          reutilices las unidades del vial anterior — un vial nuevo con distinta cantidad de péptido o
          distinta agua añadida cambia la concentración, aunque el péptido sea el mismo.
        </LI>
      </UL>

      <P>
        Si además quieres llevar el historial de cada vial que reconstituyes, con recordatorios de dosis
        y un registro que no depende de la memoria, en{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        puedes guardar cada cálculo junto con tus inyecciones reales.
      </P>
    </>
  );
}
