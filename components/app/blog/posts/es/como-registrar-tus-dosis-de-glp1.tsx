import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, OL, OLItem, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Si acabas de empezar con semaglutida, tirzepatida u otro GLP-1, seguro ya escuchaste el
        consejo: &ldquo;lleva un registro&rdquo;. Pero nadie explica bien qué anotar, cuándo hacerlo, ni por
        qué importa. Esta es la guía paso a paso que nos hubiera gustado tener el primer día.
      </P>

      <H2>¿Por qué llevar un registro, si de todos modos es una sola inyección semanal?</H2>
      <P>
        Porque el GLP-1 no se juzga por una semana suelta — se juzga por el patrón de varias semanas
        seguidas. Sin un registro, es fácil olvidar cuándo subiste de dosis, confundir si la náusea de
        esta semana es normal o distinta a la anterior, o llegar a la cita médica sin nada concreto
        que mostrar más allá de &ldquo;me ha ido bien, creo&rdquo;.
      </P>

      <H2>Los 5 datos que vale la pena anotar en cada dosis</H2>
      <UL>
        <LI>
          <strong>Fecha y hora exactas.</strong> No &ldquo;el lunes&rdquo; — la hora concreta, porque es lo que
          te permite ver si te estás corriendo de horario semana a semana.
        </LI>
        <LI>
          <strong>Dosis aplicada (mg o mcg).</strong> Sobre todo durante la titulación, cuando el
          número cambia cada pocas semanas.
        </LI>
        <LI>
          <strong>Zona de inyección.</strong> Abdomen, muslo o brazo — rotarla evita que la piel se
          irrite siempre en el mismo punto.
        </LI>
        <LI>
          <strong>Peso.</strong> No hace falta pesarte todos los días; una vez por semana, siempre en
          condiciones parecidas, es más que suficiente para ver la tendencia real.
        </LI>
        <LI>
          <strong>Efectos secundarios, si los hay.</strong> Náusea, estreñimiento, reflujo — anotar
          cuándo aparecen respecto a la dosis es lo que después te deja ver si están bajando con el
          tiempo o no.
        </LI>
      </UL>

      <H2>Cómo registrar tu primera dosis, paso a paso</H2>
      <OL>
        <OLItem n={1}>
          <strong>Anótalo en el momento, no después.</strong> "Lo escribo más tarde" es donde se pierde
          el dato la mayoría de las veces — la memoria rellena huecos con la hora que "debería haber
          sido", no la real.
        </OLItem>
        <OLItem n={2}>
          <strong>Usa siempre las mismas unidades.</strong> Si tu vial está en mg pero tú piensas en
          unidades de la jeringa, decide un solo sistema y no lo cambies a mitad de protocolo.
        </OLItem>
        <OLItem n={3}>
          <strong>Registra el peso el mismo día de la semana.</strong> El peso varía por hidratación,
          comida y hora del día — comparar lunes con lunes es lo que de verdad refleja la tendencia,
          no comparar cualquier día contra cualquier otro.
        </OLItem>
        <OLItem n={4}>
          <strong>Anota los efectos secundarios aunque sean leves.</strong> Un "náusea leve" de hoy
          contra un "náusea fuerte" de hace tres semanas es justo el dato que le sirve a tu médico
          para decidir si frenar la subida de dosis.
        </OLItem>
        <OLItem n={5}>
          <strong>Revisa el patrón cada 2-4 semanas</strong>, no cada día. El registro diario es para
          anotar; la revisión es para entender qué está pasando en conjunto.
        </OLItem>
      </OL>

      <Callout>
        Un error común: registrar solo cuando algo sale mal (una náusea fuerte, un olvido). Un
        registro que solo tiene los días malos no sirve para comparar — necesitas también los días
        normales para saber qué es, de verdad, lo inusual.
      </Callout>

      <H2>Qué mirar una vez que ya tienes semanas de datos</H2>
      <H3>La tendencia de peso, no el número de un solo día</H3>
      <P>
        Un día puede subir o bajar por agua retenida, sal en la comida o el ciclo hormonal. Lo que
        importa es la línea general de 3-4 semanas — si baja de forma sostenida, vas bien, aunque
        algún día suelto no lo parezca.
      </P>
      <H3>Si los efectos secundarios se repiten en el mismo punto del ciclo</H3>
      <P>
        Muchas personas notan más náusea los primeros 2-3 días después de cada dosis, y que mejora
        hacia el final de la semana. Verlo escrito, no solo sentido, es lo que distingue un patrón
        esperable de algo que hay que comentar con tu médico.
      </P>
      <H3>La rotación de zona de inyección</H3>
      <P>
        Si llevas semanas aplicando siempre en el mismo punto sin darte cuenta, es la causa más común
        de irritación persistente — y el registro es la única forma honesta de comprobarlo.
      </P>

      <H2>Llevarlo a tu cita médica</H2>
      <P>
        Un papelito con fechas sueltas no ayuda mucho en una consulta de 15 minutos. Lo que sí sirve
        es un resumen ordenado: dosis por semana, peso, efectos secundarios — algo que tu médico
        pueda mirar en 30 segundos y entender el patrón completo, no reconstruirlo pregunta por
        pregunta.
      </P>
      <P>
        Esto es exactamente lo que buscamos resolver con{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>
        : registras cada dosis en segundos desde el móvil, y la app arma solo la tendencia de peso,
        la racha de dosis a tiempo y un informe listo para imprimir o mostrar en la consulta — sin
        hojas de cálculo ni memoria de por medio.
      </P>

      <H2>Errores que se repiten mucho al empezar</H2>
      <UL>
        <LI>
          Cambiar de app o de cuaderno a mitad de camino y perder el historial de las primeras
          semanas — justo las que muestran cómo empezó todo.
        </LI>
        <LI>
          Anotar el peso en momentos distintos del día, lo que hace que la tendencia parezca más
          ruidosa de lo que realmente es.
        </LI>
        <LI>
          No anotar la zona de inyección porque "total, es solo una vez a la semana" — hasta que la
          piel empieza a resentirlo.
        </LI>
        <LI>
          Confiar en la memoria para la cita médica en vez de llevar algo escrito, y llegar sin poder
          responder "¿cuándo empezó la náusea, exactamente?".
        </LI>
      </UL>
    </>
  );
}
