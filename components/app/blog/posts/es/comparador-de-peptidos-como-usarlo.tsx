import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Cuando estás decidiendo entre dos péptidos, buscar cada uno por separado en distintas fuentes y
        armar la comparación tú mismo es lento y fácil de hacer mal. El{" "}
        <Link href="/comparador" className="font-semibold text-primary underline underline-offset-2">
          Comparador de péptidos
        </Link>{" "}
        pone los dos lado a lado, campo por campo, en una sola pantalla.
      </P>

      <Summary>
        Eliges dos péptidos y ves lado a lado su vía de administración, dosis común, frecuencia, vial,
        agua bacteriostática, categorías, para qué se usa, cómo funciona, lo que más se reporta, nivel
        de evidencia, efectos secundarios comunes y con qué se combina o evita. Son los mismos datos de
        referencia que usamos en el resto de la app — información para entender las diferencias, no una
        recomendación de cuál elegir.
      </Summary>

      <H2>Cómo funciona</H2>
      <P>
        Eliges un péptido A y un péptido B de la lista, y la herramienta arma automáticamente una tabla
        comparativa con estos campos:
      </P>
      <UL>
        <LI>
          <strong>Vía de administración</strong> — cómo se aplica cada uno.
        </LI>
        <LI>
          <strong>Dosis común y frecuencia</strong> — los valores de referencia habituales para cada
          péptido.
        </LI>
        <LI>
          <strong>Vial y agua bacteriostática</strong> — el tamaño de vial típico y cuánta agua se usa
          para reconstituirlo.
        </LI>
        <LI>
          <strong>Categorías y descripción</strong> — en qué grupo entra cada uno y qué es, en pocas
          palabras.
        </LI>
        <LI>
          <strong>Cómo funciona y lo que más se reporta</strong> — el mecanismo y los efectos que la
          comunidad menciona con más frecuencia.
        </LI>
        <LI>
          <strong>Nivel de evidencia y efectos secundarios comunes</strong> — para no perder de vista
          qué tan respaldado está cada dato.
        </LI>
        <LI>
          <strong>Se combina / evita</strong> — con qué otros compuestos suele mencionarse junto a este.
        </LI>
      </UL>

      <H3>De dónde salen los datos</H3>
      <P>
        Son los mismos valores de referencia (dosis común, frecuencia, vial, agua bacteriostática) que
        usamos en los perfiles individuales de cada péptido dentro de PeptiBrain — información pública
        recopilada de la misma fuente que ya usa el resto de la app, no un dato distinto inventado para
        el comparador.
      </P>

      <Callout>
        Esta comparación es informativa y educativa. La decisión de qué péptido usar, en qué dosis y
        bajo qué circunstancias corresponde siempre a un profesional de la salud — el comparador no
        recomienda uno sobre otro, solo pone los datos uno junto al otro.
      </Callout>

      <H2>Cómo sacarle el máximo partido</H2>
      <UL>
        <LI>
          <strong>Empieza por el campo que más te importe a ti</strong>, no por el orden en que aparece
          la tabla. Si lo que te preocupa es la vía de administración o la frecuencia, ve directo ahí
          antes de leer todo de arriba a abajo.
        </LI>
        <LI>
          <strong>Usa el nivel de evidencia como filtro de lectura</strong>, no como veredicto. Un dato
          con menos evidencia no es falso — es una señal de que conviene profundizar antes de sacar
          conclusiones.
        </LI>
        <LI>
          <strong>Revisa "se combina / evita" contra tu propio protocolo</strong>, no solo contra el
          otro péptido de la comparación. Si ya usas un tercer compuesto, esa combinación no aparece
          aquí — para eso está la herramienta de compatibilidad.
        </LI>
        <LI>
          <strong>Prueba varias comparaciones populares</strong> antes de decidirte por una sola pareja
          — a veces la diferencia relevante aparece al comparar un tercer candidato que no tenías en
          mente.
        </LI>
      </UL>

      <P>
        Si después de comparar ya sabes qué péptido quieres usar, en{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        puedes calcular su dosis exacta y registrar cada aplicación desde el primer día.
      </P>
    </>
  );
}
