import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, OL, OLItem, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Si empezaste terapia de reemplazo de testosterona (TRT) con cipionato, enantato u otro éster,
        tu médico probablemente ya te dijo que lleves un registro. El problema es que casi nadie
        explica qué anotar exactamente ni por qué importa más de lo que parece en un tratamiento que
        dura meses o años. Esta es esa guía.
      </P>

      <Summary>
        La TRT se evalúa por análisis de sangre y por cómo te sientes durante semanas, no por una sola
        inyección — así que anotar fecha, dosis, zona de inyección y síntomas es lo que te permite
        distinguir un patrón real de una mala semana suelta, y llevar algo concreto a tu próximo
        control con el médico.
      </Summary>

      <H2>¿Por qué llevar un registro en un tratamiento que dura años?</H2>
      <P>
        Precisamente porque dura años. En un tratamiento corto, la memoria alcanza; en uno que se
        repite cada semana durante mucho tiempo, es fácil perder de vista cuándo se ajustó la última
        dosis, si el cansancio de este mes es distinto al anterior, o si esa zona de inyección lleva
        rotándose de verdad o siempre cae en el mismo punto sin darte cuenta.
      </P>

      <H2>Los 4 datos que vale la pena anotar en cada inyección</H2>
      <UL>
        <LI>
          <strong>Fecha y hora exactas.</strong> La consistencia en el intervalo entre inyecciones
          (semanal, dos veces por semana, día por medio) influye en qué tan estables se mantienen tus
          niveles — y sin fecha exacta no hay forma de comprobar si de verdad la estás respetando.
        </LI>
        <LI>
          <strong>Dosis aplicada (mg) y concentración del vial.</strong> Sobre todo si cambias de
          proveedor o de concentración (100, 200, 250 mg/mL) — un mismo volumen en mL puede ser una
          dosis muy distinta según la concentración.
        </LI>
        <LI>
          <strong>Zona de inyección.</strong> Glúteo, muslo o deltoides — rotarla de verdad (no solo
          de intención) evita que se forme tejido cicatricial o irritación persistente en el mismo
          punto.
        </LI>
        <LI>
          <strong>Síntomas entre dosis.</strong> Energía, ánimo, libido, sueño — anotar cómo te sientes
          día a día es lo que después te permite ver si coincide con el momento del ciclo en que la
          testosterona está más alta o más baja.
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
          <strong>Calcula el volumen antes de cargar la jeringa.</strong> Con la dosis en mg y la
          concentración del vial (mg/mL), el volumen exacto en mL sale de una simple división — no
          hace falta calcularlo de memoria cada semana.
        </OLItem>
        <OLItem n={3}>
          <strong>Anota la zona antes de guardar el vial.</strong> Si lo dejas para después, es fácil
          olvidar si tocaba glúteo derecho o izquierdo esta semana.
        </OLItem>
        <OLItem n={4}>
          <strong>Registra tus síntomas aunque sean sutiles.</strong> Un "más cansado que de costumbre"
          de hoy contra el mismo dato de hace tres semanas es justo lo que le sirve a tu médico para
          decidir si el intervalo o la dosis necesitan un ajuste.
        </OLItem>
        <OLItem n={5}>
          <strong>Revisa el patrón antes de cada análisis de sangre</strong>, no cada día. El registro
          diario es para anotar; la revisión es para llegar a la extracción sabiendo qué preguntar.
        </OLItem>
      </OL>

      <Callout>
        Un error común: registrar solo cuando algo se siente mal (un bajón de energía, más
        irritabilidad). Un registro que solo tiene los días malos no sirve para comparar — necesitas
        también los días normales para saber qué es, de verdad, lo inusual.
      </Callout>

      <H2>Qué mirar una vez que ya tienes semanas de datos</H2>
      <H3>La consistencia del intervalo, no solo si "más o menos" te inyectaste</H3>
      <P>
        Un intervalo que varía mucho semana a semana (a veces cada 5 días, a veces cada 9) genera más
        altibajos en tus niveles que uno más constante. El registro es la única forma honesta de ver
        si de verdad estás siendo tan regular como crees.
      </P>
      <H3>Si los síntomas se repiten en el mismo punto del ciclo</H3>
      <P>
        Con inyecciones semanales, es común notar más energía los primeros días y algo de bajón hacia
        el final de la semana, antes de la siguiente dosis. Verlo escrito, no solo sentido, es lo que
        distingue un patrón esperable (que puede sugerir probar una frecuencia distinta) de algo que
        hay que comentar directamente con tu médico.
      </P>
      <H3>La rotación real de zona de inyección</H3>
      <P>
        Si llevas semanas aplicando siempre en el mismo punto sin darte cuenta, es la causa más común
        de irritación persistente o zonas más duras al tacto — y el registro es la única forma
        honesta de comprobarlo.
      </P>

      <H2>Llevarlo a tu próximo control con el médico</H2>
      <P>
        Un intervalo aproximado de memoria no ayuda mucho en una consulta de 15 minutos, sobre todo
        cuando el análisis de sangre depende de cuánto tiempo pasó desde tu última inyección. Lo que
        sí sirve es un resumen ordenado: fecha e intervalo real entre dosis, síntomas relevantes,
        cualquier cambio de proveedor o concentración — algo que tu médico pueda mirar en 30 segundos
        y entender el patrón completo.
      </P>
      <P>
        Esto es exactamente lo que buscamos resolver con{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>
        : registras cada inyección en segundos desde el móvil, calculas el volumen exacto con nuestra{" "}
        <Link href="/calculadora-trt" className="font-semibold text-primary underline underline-offset-2">
          calculadora de dosis de TRT
        </Link>
        , y la app arma sola la racha de inyecciones a tiempo y un informe listo para mostrar en tu
        próximo control — sin hojas de cálculo ni memoria de por medio.
      </P>

      <H2>Errores que se repiten mucho al empezar</H2>
      <UL>
        <LI>
          No anotar la concentración del vial al cambiar de proveedor, y calcular el volumen como si
          siguiera siendo la misma de antes.
        </LI>
        <LI>
          Dejar que el intervalo entre inyecciones se estire "un par de días" sin registrarlo, hasta
          que ya no es un par de días sino una semana entera de diferencia acumulada.
        </LI>
        <LI>
          No anotar la zona de inyección porque "es solo una vez a la semana" — hasta que un mismo
          punto empieza a resentirse.
        </LI>
        <LI>
          Confiar en la memoria para el control médico en vez de llevar algo escrito, y llegar sin
          poder responder "¿cuánto tiempo pasó exactamente desde tu última dosis?" — un dato que
          cambia cómo se interpreta el análisis de sangre.
        </LI>
      </UL>
    </>
  );
}
