import { Link } from "@/i18n/navigation";
import { H2, P, OL, OLItem, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Después de repasar qué son los péptidos, cómo reconstituirlos y los más buscados por objetivo, toca la
        parte más práctica: los errores que se repiten una y otra vez entre quien empieza — y cómo evitarlos.
      </P>

      <H2>Los 7 errores más comunes</H2>
      <OL>
        <OLItem n={1}>
          <strong>Calcular la dosis a ojo.</strong> Pasar de miligramos a unidades de jeringa de cabeza es donde
          se cuela la mayoría de los fallos, sobre todo con vials distintos que tienen distinta concentración.
        </OLItem>
        <OLItem n={2}>
          <strong>Cambiar la cantidad de agua cada vez.</strong> Si un día usas 2 mL y otro 3 mL para el mismo
          péptido, la concentración cambia y tu cálculo anterior deja de servir.
        </OLItem>
        <OLItem n={3}>
          <strong>No anotar la fecha de reconstitución.</strong> Sin ese dato es imposible saber cuándo caduca el
          vial ya mezclado — y usar un vial vencido no es lo mismo que usar uno recién reconstituido.
        </OLItem>
        <OLItem n={4}>
          <strong>Confundir mg con mcg.</strong> Es un error de unidad, no de cantidad — y multiplica o divide
          por mil el resultado. Pasa sobre todo con péptidos como el BPC-157, cuyas dosis se manejan en mcg.
        </OLItem>
        <OLItem n={5}>
          <strong>No llevar ningún registro.</strong> Sin anotar qué te aplicaste y cuándo, es imposible saber si
          algo está funcionando, si te saltaste una dosis, o cuánto llevas invertido.
        </OLItem>
        <OLItem n={6}>
          <strong>Comprar un vial más grande &ldquo;para ahorrar&rdquo; sin calcular el ritmo de uso.</strong> Si el vial
          caduca antes de que te dé tiempo a gastarlo a tu ritmo de dosis, terminas tirando producto — lo
          contrario de ahorrar.
        </OLItem>
        <OLItem n={7}>
          <strong>Subir la dosis por impaciencia.</strong> Los esquemas de titulación gradual (como el de la
          semaglutida) existen por una razón: saltárselos aumenta el riesgo de efectos secundarios sin ninguna
          ventaja real.
        </OLItem>
      </OL>

      <Callout>
        Casi todos estos errores tienen la misma solución de fondo: dejar de calcular y registrar de memoria, y
        empezar a apoyarse en una herramienta que lo haga por ti.
      </Callout>

      <H2>Cómo evitarlos, en la práctica</H2>
      <P>
        Usa siempre una{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          calculadora de reconstitución
        </Link>{" "}
        en vez de calcular a mano, anota la fecha en la que abres cada vial, y lleva un registro de cada dosis
        aplicada — aunque sea en una nota del móvil. Si ya usas varios péptidos a la vez, una app dedicada a
        esto (como PeptiBrain) te evita justo estos siete errores sin esfuerzo extra.
      </P>
    </>
  );
}
