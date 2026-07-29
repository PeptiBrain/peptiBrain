import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";

const FAQ_ITEMS = [
  {
    q: "¿PeptiBrain es gratis?",
    a: "Sí, tiene un plan gratuito real (no solo una prueba) para un péptido y un vial activo. Los planes pagos añaden péptidos ilimitados, calculadoras completas, asistente con IA y más.",
  },
  {
    q: "¿Necesito receta o seguimiento médico para usar PeptiBrain?",
    a: "PeptiBrain no exige ni verifica una receta — es una herramienta de organización, no de dispensación. Pero cualquier protocolo de péptidos, GLP-1 o TRT debería llevarse siempre bajo supervisión médica, con o sin la app.",
  },
  {
    q: "¿Sirve solo para GLP-1, o también para TRT y otros péptidos?",
    a: "Sirve para los tres: péptidos de recuperación y estéticos, GLP-1 (semaglutida, tirzepatida) y TRT — cada uno con sus propias calculadoras y campos de registro.",
  },
  {
    q: "¿Está disponible en español?",
    a: "Sí, en español real (no traducido a medias) y también en inglés, con detección automática de idioma según tu país.",
  },
  {
    q: "¿Es segura mi información?",
    a: "Tus datos quedan asociados a tu cuenta, con control de acceso por fila (RLS) en la base de datos — nadie más ve tu protocolo salvo que tú compartas el acceso explícitamente (plan Family).",
  },
];

export default function Post() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <P>
        Si buscaste &ldquo;qué es PeptiBrain&rdquo; para saber de qué trata antes de crear una cuenta, esta es la
        guía completa. Nada de vueltas: qué es, para quién está pensada, cómo cambia tu día a día una vez que la
        usas, y absolutamente todo lo que incluye — para que decidas con información real, no con una frase de
        marketing de una línea.
      </P>

      <Summary>
        PeptiBrain es una aplicación web para llevar el registro de tus dosis, viales y protocolo de péptidos,
        GLP-1 o TRT en un solo lugar, en español — calculadoras, historial, recordatorios, seguimiento de salud
        y un informe listo para tu médico. No decide tu dosis ni sustituye una consulta médica: organiza y
        calcula lo que tu protocolo ya indica.
      </Summary>

      <H2>¿Qué es PeptiBrain, exactamente?</H2>
      <P>
        PeptiBrain es una app de seguimiento (no una tienda, no un foro, no una consulta médica) pensada para
        una situación muy concreta: llevas un protocolo de péptidos, de GLP-1 (semaglutida, tirzepatida) o de
        terapia de reemplazo de testosterona (TRT), y necesitas un lugar único donde quede registrado cada
        vial, cada dosis y cada dato relevante — sin depender de notas sueltas en el móvil, una libreta o la
        memoria.
      </P>
      <P>
        A diferencia de la mayoría de apps de este tipo, que solo existen en inglés, PeptiBrain nació pensando
        primero en la comunidad hispanohablante — la interfaz, el asistente y el soporte están en español real,
        no traducidos a medias.
      </P>

      <H2>¿Para quién es PeptiBrain? (nuestro usuario típico)</H2>
      <P>
        No hace falta encajar en un único perfil — PeptiBrain sirve para varias situaciones distintas que
        comparten el mismo problema de fondo: llevar un protocolo sin perder el hilo.
      </P>
      <UL>
        <LI>
          <strong>Estás en tratamiento con GLP-1</strong> (semaglutida, tirzepatida) para bajar de peso y
          necesitas llevar la titulación semanal, tu peso y tus efectos secundarios sin perderte entre fases.
        </LI>
        <LI>
          <strong>Sigues un protocolo de péptidos de recuperación o estéticos</strong> (BPC-157, TB-500,
          GHK-Cu) y quieres calcular bien la reconstitución y no olvidar ninguna aplicación.
        </LI>
        <LI>
          <strong>Estás en TRT</strong> y necesitas ser constante con el intervalo entre inyecciones, porque
          afecta directamente a cómo se interpretan tus análisis de sangre.
        </LI>
        <LI>
          <strong>Llevas el protocolo de otra persona</strong> (pareja, familiar) además del tuyo, y quieres
          organizarlo todo desde una sola cuenta con el plan Family.
        </LI>
        <LI>
          <strong>Ya usas una app de este tipo, pero está en inglés</strong> y quieres algo pensado para ti
          desde el principio, sin traducciones a medias.
        </LI>
      </UL>

      <H2>El problema: cómo era el día a día antes de PeptiBrain</H2>
      <P>
        La razón por la que existe PeptiBrain es siempre la misma historia, contada de mil formas distintas:
        notas de la última dosis dispersas entre el bloc de notas del móvil, una foto del vial y la memoria.
        Calcular a mano cuántas unidades cargar cada semana, con la calculadora del móvil, sin estar seguro de
        no haberse equivocado. No saber si ayer ya te tocaba o no. Y al llegar a la consulta médica, intentar
        reconstruir de memoria un mes de dosis, peso y síntomas — y llegar con la sensación de que se te olvidó
        justo el dato que importaba.
      </P>

      <H2>Después de PeptiBrain: cómo cambia tu día a día</H2>
      <P>
        Con el protocolo ya cargado, registrar una dosis toma segundos desde el móvil. La app ya sabe qué
        péptido te toca hoy, calcula sola las unidades según la concentración de tu vial, y te avisa cuando se
        acerca la fecha de vencimiento de un vial abierto. La racha de días seguidos se lleva sola. Y cuando
        llega tu cita médica, no llevas la memoria — llevas un informe generado en segundos con tu adherencia,
        tu tendencia de peso y tus efectos secundarios.
      </P>
      <Callout>
        Nada de esto sustituye a tu médico ni decide tu dosis: PeptiBrain organiza y calcula lo que tu protocolo
        ya indica — la decisión médica sigue siendo siempre de tu profesional de salud.
      </Callout>

      <H2>Todo lo que incluye PeptiBrain</H2>
      <H3>Registro y cálculo del protocolo</H3>
      <UL>
        <LI>Registro de dosis, viales y protocolo completo, con historial de todo lo aplicado.</LI>
        <LI>Calculadora de reconstitución (mg + agua bacteriostática → unidades de jeringa).</LI>
        <LI>Calculadora de semaglutida y tirzepatida con la tabla completa de titulación.</LI>
        <LI>Calculadora de dosis de TRT (mg, mL y unidades según concentración y frecuencia).</LI>
        <LI>Control de vial: cuánto queda y cuándo caduca.</LI>
      </UL>
      <H3>Herramientas gratuitas (sin registro)</H3>
      <UL>
        <LI>
          <Link href="/comparador" className="font-semibold text-primary underline underline-offset-2">
            Comparador de péptidos
          </Link>{" "}
          lado a lado.
        </LI>
        <LI>
          <Link href="/compatibilidad" className="font-semibold text-primary underline underline-offset-2">
            Compatibilidad de stacks
          </Link>{" "}
          — si dos compuestos se pueden combinar.
        </LI>
        <LI>Calculadora de eliminación (vida media) y de costo por mg.</LI>
        <LI>Quiz orientativo de nivel de testosterona (no diagnostica, solo orienta si vale la pena un análisis).</LI>
      </UL>
      <H3>Salud y seguimiento</H3>
      <UL>
        <LI>Peso, comidas y notas de bienestar en un mismo lugar.</LI>
        <LI>Recordatorios de cada aplicación y racha de constancia.</LI>
        <LI>Comparador de fotos de progreso.</LI>
        <LI>Asistente con IA para dudas generales (no sustituye consejo médico).</LI>
      </UL>
      <H3>Familia e informe médico</H3>
      <UL>
        <LI>Plan Family: hasta 3 cuentas, viales y rutinas compartidas, cada quien con su privacidad.</LI>
        <LI>Informe listo para tu consulta: adherencia, racha, tendencia de peso y efectos secundarios.</LI>
      </UL>

      <H2>Lo que PeptiBrain NO es</H2>
      <P>
        PeptiBrain no diagnostica, no prescribe y no decide tu dosis. No es una farmacia ni un proveedor de
        péptidos. No sustituye a un profesional de la salud en ningún momento del proceso — organiza y calcula
        lo que tu protocolo ya indica, y punto. La decisión sobre qué usar, en qué dosis y bajo qué supervisión
        es siempre de tu médico.
      </P>

      <H2>Planes y precios</H2>
      <P>
        Puedes empezar gratis (un péptido, un vial activo, racha y calendario) y subir a Premium cuando lo
        necesites (péptidos y viales ilimitados, calculadoras, asistente con IA, salud completa) o a Family si
        además llevas el protocolo de alguien más. Los precios y detalles exactos de cada plan están en la{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          página principal
        </Link>
        .
      </P>

      <H2>Preguntas frecuentes</H2>
      <H3>¿PeptiBrain es gratis?</H3>
      <P>
        Sí, tiene un plan gratuito real (no solo una prueba) para un péptido y un vial activo. Los planes
        pagos añaden péptidos ilimitados, calculadoras completas, asistente con IA y más.
      </P>
      <H3>¿Necesito receta o seguimiento médico para usar PeptiBrain?</H3>
      <P>
        PeptiBrain no exige ni verifica una receta — es una herramienta de organización, no de dispensación.
        Pero cualquier protocolo de péptidos, GLP-1 o TRT debería llevarse siempre bajo supervisión médica,
        con o sin la app.
      </P>
      <H3>¿Sirve solo para GLP-1, o también para TRT y otros péptidos?</H3>
      <P>
        Sirve para los tres: péptidos de recuperación y estéticos, GLP-1 (semaglutida, tirzepatida) y TRT —
        cada uno con sus propias calculadoras y campos de registro.
      </P>
      <H3>¿Está disponible en español?</H3>
      <P>
        Sí, en español real (no traducido a medias) y también en inglés, con detección automática de idioma
        según tu país.
      </P>
      <H3>¿Es segura mi información?</H3>
      <P>
        Tus datos quedan asociados a tu cuenta, con control de acceso por fila (RLS) en la base de datos —
        nadie más ve tu protocolo salvo que tú compartas el acceso explícitamente (plan Family).
      </P>

      <P>
        Si ya tienes claro que necesitas ordenar tu protocolo, puedes{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          probar PeptiBrain gratis
        </Link>{" "}
        y empezar a registrar tu primera dosis en menos de un minuto.
      </P>
    </>
  );
}
