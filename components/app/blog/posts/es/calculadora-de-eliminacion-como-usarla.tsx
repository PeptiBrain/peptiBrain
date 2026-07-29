import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        &ldquo;¿Cuánto tarda esto en salir de mi cuerpo?&rdquo; es una pregunta que depende de la vida
        media de cada compuesto — un dato de farmacología, no una opinión. La{" "}
        <Link href="/calculadora-eliminacion" className="font-semibold text-primary underline underline-offset-2">
          Calculadora de eliminación
        </Link>{" "}
        toma ese dato y lo convierte en un tiempo estimado, sin adivinar nada que no tengamos respaldado.
      </P>

      <Summary>
        Eliges un péptido de la lista y la herramienta te muestra su vida media conocida y el tiempo
        estimado de eliminación, calculado como 5 vidas medias (~97% eliminado) — la regla estándar de
        farmacología, la misma que usan las calculadoras clínicas. Solo aparecen los péptidos con un
        dato de vida media confiable; el resto se queda fuera a propósito.
      </Summary>

      <H2>Cómo funciona</H2>
      <P>
        Eliges un péptido del selector y la calculadora te muestra su vida media (el tiempo que tarda la
        cantidad del compuesto en tu cuerpo en reducirse a la mitad) y, a partir de ahí, el tiempo
        estimado de eliminación completa.
      </P>

      <H3>Por qué 5 vidas medias</H3>
      <P>
        Es la regla estándar de farmacología: tras 5 vidas medias, un compuesto se considera
        prácticamente eliminado del organismo (~97%). No es un número que inventamos para esta
        calculadora — es la misma referencia que usan las calculadoras clínicas en general. Por eso el
        resultado que ves es siempre 5 veces la vida media de ese péptido en concreto.
      </P>
      <H3>Por qué no aparecen todos los péptidos</H3>
      <P>
        La calculadora solo incluye los péptidos que tienen un dato de vida media confiable. Cuando ese
        dato no existe, o está demasiado disperso entre fuentes, preferimos no mostrar el péptido en vez
        de darte una estimación inventada que parezca más completa de lo que realmente es.
      </P>

      <Callout>
        El propio resultado incluye la advertencia: varía según metabolismo, dosis acumulada y otros
        factores individuales — no es un dato exacto para ti en particular, es una estimación basada en
        la vida media conocida del compuesto.
      </Callout>

      <H2>Cómo sacarle el máximo partido</H2>
      <UL>
        <LI>
          <strong>Úsala para entender el orden de magnitud, no el día exacto.</strong> Saber si un
          compuesto tarda horas, días o semanas en eliminarse es lo útil — el número preciso siempre
          depende de factores individuales que la calculadora no puede conocer.
        </LI>
        <LI>
          <strong>Compárala con tu frecuencia de dosis, no la mires aislada.</strong> Si tu intervalo
          entre dosis es más corto que la vida media del compuesto, hay acumulación esperable en tu
          organismo — eso es información útil para entender por qué tu protocolo está diseñado como
          está.
        </LI>
        <LI>
          <strong>Si tu péptido no aparece en el selector</strong>, no asumas un tiempo de eliminación
          por comparación con otro compuesto parecido — la ausencia significa que no hay un dato
          confiable, no que sea instantáneo ni indefinido.
        </LI>
        <LI>
          <strong>Llévalo como pregunta a tu médico</strong>, sobre todo antes de un análisis de sangre
          o si vas a combinarlo con otro tratamiento — la calculadora te da el punto de partida de la
          conversación, no la respuesta final.
        </LI>
      </UL>

      <P>
        Si quieres cruzar este dato con tu propio historial de dosis — cuándo empezaste, cuándo
        pausaste, qué tan seguido te inyectaste —{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        lleva ese registro por ti, listo para revisar junto con esta calculadora.
      </P>
    </>
  );
}
