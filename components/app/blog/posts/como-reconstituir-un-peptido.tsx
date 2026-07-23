import { Link } from "@/i18n/navigation";
import { H2, P, OL, OLItem, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        La reconstitución es el paso que más dudas genera al empezar: viene el péptido en polvo dentro de un
        vial y hay que &ldquo;activarlo&rdquo; con agua antes de poder aplicarlo. Suena más complicado de lo que es — vamos
        paso a paso.
      </P>

      <H2>¿Qué es el agua bacteriostática?</H2>
      <P>
        Es agua estéril con un conservante (alcohol bencílico) que evita el crecimiento bacteriano durante los
        días que el vial ya reconstituido está en uso. No es agua normal ni agua destilada — se usa
        específicamente para esto porque permite múltiples usos del mismo vial sin que se contamine.
      </P>

      <H2>Los 4 pasos</H2>
      <OL>
        <OLItem n={1}>
          <strong>Mira los mg del vial.</strong> Todos los viales indican cuánto péptido en polvo contienen (por
          ejemplo, 5 mg). Ese dato no cambia, lo determina el fabricante.
        </OLItem>
        <OLItem n={2}>
          <strong>Decide cuánta agua vas a añadir.</strong> No hay una única cantidad &ldquo;correcta&rdquo; — cuanta más
          agua, más diluido queda y más unidades tendrás que cargar para la misma dosis. Lo importante es ser
          consistente: usa siempre la misma cantidad para ese vial concreto.
        </OLItem>
        <OLItem n={3}>
          <strong>Calcula la concentración.</strong> Es simplemente mg ÷ mL de agua. Un vial de 5 mg con 2 mL de
          agua queda a 2,5 mg/mL. Esa cifra es la que necesitas para saber cuánto cargar después.
        </OLItem>
        <OLItem n={4}>
          <strong>Guarda el vial en frío</strong> y anota la fecha en que lo reconstituiste — a partir de ahí
          empieza a contar su vida útil.
        </OLItem>
      </OL>

      <Callout>
        Un vial ya reconstituido no dura para siempre. La referencia habitual en la comunidad es de unos 30
        días en frío, aunque varía según el péptido — pasado ese tiempo, se suele descartar aunque quede
        producto dentro.
      </Callout>

      <H2>De la concentración a la jeringa: unidades, no miligramos</H2>
      <P>
        Aquí es donde más gente se confunde: en la jeringa de insulina no cargas miligramos, cargas{" "}
        <strong>unidades</strong> (en una jeringa U-100, 100 unidades equivalen a 1 mL). Para saber cuántas
        unidades corresponden a tu dosis, necesitas cruzar tres datos: la concentración de tu vial, la dosis que
        quieres aplicar y el tipo de jeringa.
      </P>
      <P>
        Hacer esa cuenta de cabeza cada vez es donde se cuelan la mayoría de los errores. Nuestra{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          calculadora de reconstitución gratuita
        </Link>{" "}
        hace justo esa conversión al instante, con un dibujo de la jeringa para que no falles.
      </P>

      <H2>Errores que se repiten mucho</H2>
      <P>
        Cambiar la cantidad de agua &ldquo;a ojo&rdquo; de un vial a otro del mismo péptido, no anotar cuándo se reconstituyó
        cada vial, y confiar en la memoria para la dosis en vez de llevar un registro escrito. Los tres se
        arreglan con el mismo hábito: anotarlo todo desde el primer día.
      </P>
    </>
  );
}
