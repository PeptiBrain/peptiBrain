import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary, Sources } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        La semaglutida y la tirzepatida no se empiezan en la dosis de mantenimiento — se suben poco a
        poco durante varias semanas (titulación). Eso significa que la cuenta de &ldquo;cuántas unidades
        cargo&rdquo; cambia cada mes, no solo una vez. Para no tener que rehacerla a mano en cada fase,
        construimos la{" "}
        <Link href="/calculadora-semaglutida" className="font-semibold text-primary underline underline-offset-2">
          Calculadora de semaglutida y tirzepatida
        </Link>
        .
      </P>

      <Summary>
        Eliges el compuesto, indicas los mg de tu vial y el agua bacteriostática que añadiste, y la
        calculadora te muestra la tabla completa de titulación semanal con las unidades exactas a
        cargar en cada fase — desde la primera semana hasta la dosis de mantenimiento. El esquema que
        ves es la referencia estándar, no un ajuste personalizado: eso lo define tu médico.
      </Summary>

      <H2>Cómo funciona</H2>
      <P>
        Eliges el compuesto (semaglutida o tirzepatida), metes los mg de tu vial y el agua que le
        añadiste, y la calculadora fija la concentración. Con eso arma una tabla: cada fila es una fase
        semanal, con su dosis en mg y las unidades que hay que cargar en una jeringa U100 para esa fase.
        Tocas una fila y ves esa fase concreta dibujada en la jeringa, para no tener que traducir el
        número tú mismo.
      </P>

      <H3>El esquema de referencia de la semaglutida</H3>
      <P>
        La tabla que usa la calculadora sube de 0,25 mg semanales durante 4 semanas, luego pasa a 0,5
        mg, 1,0 mg, 1,7 mg y hasta 2,4 mg de mantenimiento, cambiando de fase cada 4 semanas. Es el
        esquema de referencia general — tu médico puede ajustarlo a tu caso concreto.
      </P>
      <H3>El esquema de referencia de la tirzepatida</H3>
      <P>
        Para tirzepatida, el esquema de referencia empieza en 2,5 mg semanales y sube cada 4 semanas:
        5, 7,5, 10, 12,5 y hasta 15 mg de mantenimiento. Igual que con semaglutida, siempre según
        indicación médica.
      </P>

      <H2>Por qué existe la titulación (y por qué no te la saltas)</H2>
      <P>
        Subir la dosis poco a poco, en vez de empezar directo en la dosis de mantenimiento, es lo que
        reduce los efectos secundarios digestivos que estos medicamentos pueden causar al principio. La
        calculadora no decide por ti en qué fase estás ni cuándo subir — eso lo indica y supervisa tu
        profesional de salud. Lo que hace es traducir la fase que te toca a las unidades exactas de tu
        jeringa, según la concentración real de tu vial.
      </P>

      <Callout>
        La calculadora te muestra unidades, no miligramos, porque en la jeringa cargas volumen, no
        peso. Convierte los mg de cada fase a las unidades exactas de la U100 usando la concentración
        de tu vial concreto — que puede ser distinta a la del vial de otra persona aunque el compuesto
        sea el mismo.
      </Callout>

      <H2>Cómo sacarle el máximo partido</H2>
      <UL>
        <LI>
          <strong>Revisa la tabla completa antes de empezar</strong>, no solo la primera fila. Ver todo
          el camino de titulación de una vez ayuda a entender por qué la dosis sube gradualmente y qué
          esperar en las próximas semanas.
        </LI>
        <LI>
          <strong>Recalcula si cambias de vial o de concentración.</strong> Un vial nuevo con distinta
          cantidad de compuesto o distinta agua añadida cambia la concentración, y con ella las
          unidades que corresponden a cada fase — aunque el compuesto sea el mismo.
        </LI>
        <LI>
          <strong>Si la calculadora avisa que superas 1 jeringa U100 (100 U)</strong>, no fuerces una
          segunda carga por tu cuenta — es la señal de que necesitas más de una jeringa o ajustar la
          concentración con tu médico.
        </LI>
        <LI>
          <strong>Usa la tabla como referencia de conversación, no como receta.</strong> El esquema que
          ves aquí es el estándar de referencia; la fase, la velocidad de subida y la dosis final que
          te corresponden a ti las decide tu médico.
        </LI>
      </UL>

      <P>
        Si ya empezaste tu tratamiento y quieres llevar el registro de cada dosis aplicada junto con tu
        fase de titulación, en{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        puedes guardar cada inyección y ver tu historial completo en un solo lugar.
      </P>

      <Sources
        label="Fuentes"
        items={[
          {
            title: "Tirzepatide Once Weekly for the Treatment of Obesity — SURMOUNT-1 (New England Journal of Medicine)",
            url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038",
          },
          {
            title: "Two-year effects of semaglutide in adults with overweight or obesity — STEP 5 trial",
            url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9556320/",
          },
        ]}
      />
    </>
  );
}
