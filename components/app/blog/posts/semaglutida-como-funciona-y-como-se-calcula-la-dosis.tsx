import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        La semaglutida es, hoy, el péptido más buscado del mundo del control de peso — y probablemente el más
        mal entendido en cuanto a cómo se dosifica. Vamos a aclarar las dos cosas: qué hace y cómo se calcula
        correctamente.
      </P>

      <H2>¿Qué es y cómo actúa?</H2>
      <P>
        La semaglutida es un agonista del receptor GLP-1 (una hormona que el propio intestino produce de forma
        natural). Actuando sobre ese receptor, ralentiza el vaciado del estómago, reduce el apetito y mejora la
        sensibilidad a la insulina. Es el mismo mecanismo que comparte con otros GLP-1 conocidos, y el que
        explica por qué se asocia tanto al control de peso.
      </P>

      <H2>Por qué la dosis sube poco a poco (titulación)</H2>
      <P>
        Casi nadie empieza directamente en la dosis &ldquo;final&rdquo;. El protocolo de referencia sube gradualmente cada 4
        semanas, precisamente para reducir efectos secundarios digestivos mientras el cuerpo se adapta:
      </P>
      <UL>
        <LI>Semanas 1-4: 0,25 mg semanales</LI>
        <LI>Semanas 5-8: 0,5 mg semanales</LI>
        <LI>Semanas 9-12: 1 mg semanales</LI>
        <LI>Semanas 13-16: 1,7 mg semanales</LI>
        <LI>Semana 17 en adelante: 2,4 mg de mantenimiento</LI>
      </UL>
      <Callout>
        Este esquema es el de referencia habitual, no una prescripción. La dosis, el ritmo de subida y si es
        adecuada para ti debe decidirlo un profesional de la salud.
      </Callout>

      <H2>El problema real: pasar de mg a unidades de jeringa</H2>
      <P>
        Aquí está el punto donde más gente se equivoca: la dosis se indica en miligramos, pero la jeringa se
        carga en <strong>unidades</strong>. Para convertir de uno a otro necesitas la concentración de tu vial
        (que depende de los mg del vial y el agua que le añadiste al reconstituir), y aplicar esa concentración a
        la dosis de la semana en la que estás.
      </P>
      <P>
        Hacerlo mal en cualquiera de las dos direcciones tiene consecuencias: cargar de menos significa que la
        dosis &ldquo;no hace nada&rdquo; (y se abandona el protocolo pensando que no funciona), y cargar de más se sale del
        esquema gradual que precisamente busca minimizar los efectos secundarios.
      </P>

      <H2>Semaglutida vs. tirzepatida</H2>
      <P>
        La tirzepatida sigue una lógica muy similar (también se titula por fases), pero actúa sobre dos
        receptores en vez de uno (GIP y GLP-1), lo que en la práctica cambia su esquema de dosis: empieza en 2,5
        mg semanales y sube hasta 15 mg de mantenimiento — números distintos a los de la semaglutida, así que no
        se pueden mezclar los esquemas de una y otra.
      </P>

      <H2>Cómo evitar el error de cálculo</H2>
      <P>
        La forma más simple de no equivocarte es no hacer la cuenta de memoria cada semana. Nuestra{" "}
        <Link href="/calculadora-semaglutida" className="font-semibold text-primary underline underline-offset-2">
          calculadora de semaglutida y tirzepatida
        </Link>{" "}
        tiene ya cargada la tabla de titulación completa: eliges la fase en la que estás y te muestra las
        unidades exactas a cargar, con la jeringa dibujada.
      </P>
    </>
  );
}
