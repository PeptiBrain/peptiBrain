import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";
import { CompatComboTable, type CompatComboRow } from "@/components/app/blog/CompatComboTable";

const ROWS: CompatComboRow[] = [
  { a: "BPC-157", b: "TB-500", status: "studied", statusLabel: "Estudiado", note: "Combo clásico de recuperación — el más reportado de toda la comunidad." },
  { a: "Ipamorelina", b: "CJC-1295", status: "studied", statusLabel: "Estudiado", note: "Combo clásico GHRH + GHRP — el más reportado de esta categoría." },
  { a: "Selank", b: "Semax", status: "studied", statusLabel: "Estudiado", note: "Combo clásico nootrópico: calma (Selank) + enfoque (Semax)." },
  { a: "Semaglutida", b: "BPC-157", status: "caution", statusLabel: "Precaución", note: "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual." },
  { a: "Semaglutida", b: "Tirzepatida", status: "avoid", statusLabel: "Evitar", note: "Dos agonistas GLP-1/GIP a la vez no se recomienda combinarlos." },
  { a: "Ipamorelina", b: "GHRP-2", status: "avoid", statusLabel: "Evitar", note: "No se recomienda combinar dos GHRP a la vez." },
];

export default function Post() {
  return (
    <>
      <P>
        &ldquo;¿Puedo combinar esto con aquello?&rdquo; es una de las preguntas que más se repite en
        cualquier comunidad de péptidos — y la que peor suelen responder las tablas gigantes tipo
        matriz, donde encontrar tu combinación concreta es más difícil que la propia pregunta. Por eso
        construimos{" "}
        <Link href="/compatibilidad" className="font-semibold text-primary underline underline-offset-2">
          Compatibilidad de stacks
        </Link>
        : eliges dos compuestos y te devolvemos un solo veredicto, no 500 celdas.
      </P>

      <Summary>
        La herramienta responde una pregunta concreta (A + B, ¿sí o no?) con 4 estados posibles —
        estudiado, precaución, evitar o sin datos — sacados siempre de lo que cada perfil de péptido
        ya afirma, nunca de una suposición. Cuando no hay dato, decimos &ldquo;sin datos&rdquo; en vez
        de inventar un veredicto.
      </Summary>

      <H2>Cómo funciona</H2>
      <P>
        Eliges dos compuestos de la lista y la herramienta te muestra al instante uno de estos cuatro
        estados. Ningún veredicto se inventa para rellenar un hueco — si la combinación no aparece en
        ninguna fuente, el resultado es honesto: &ldquo;sin datos&rdquo;, no un semáforo en verde o
        rojo fabricado.
      </P>

      <H3>Estudiado</H3>
      <P>
        La propia fuente (el perfil de alguno de los dos péptidos, o ambos) nombra explícitamente esa
        combinación — por ejemplo, el blend de recuperación &ldquo;GLOW&rdquo; (BPC-157 + GHK-Cu +
        TB-500) o la sinergia clásica GHRH + GHRP.
      </P>
      <H3>Precaución</H3>
      <P>
        Los mecanismos no chocan entre sí, pero tampoco existe un estudio formal de esa combinación
        puntual — solo plausibilidad por categoría (por ejemplo, un GLP-1 junto a un péptido de
        recuperación: mecanismos completamente distintos, sin conflicto conocido, pero sin ensayo
        específico de la mezcla).
      </P>
      <H3>Evitar</H3>
      <P>
        Hay una razón concreta para no combinarlos — casi siempre porque son dos compuestos de la
        misma familia haciendo el mismo trabajo (dos GHRP, dos análogos de GHRH, dos agonistas
        GLP-1/GIP a la vez), lo que no suma efecto, solo redundancia.
      </P>
      <H3>Sin datos</H3>
      <P>
        La combinación no aparece en ninguna fuente que usamos. No significa que esté prohibida ni que
        la app esté rota — significa, literalmente, que no encontramos nada publicado sobre esa mezcla
        en concreto. Preferimos decir eso a inventar un veredicto que parezca más completo.
      </P>

      <H2>Los combos más consultados</H2>
      <CompatComboTable rows={ROWS} />

      <Callout>
        Estos son solo 6 ejemplos para ilustrar los 4 estados — la herramienta cubre bastantes más
        combinaciones dentro de recuperación/piel, GLP-1, péptidos de crecimiento (GHRH/GHRP) y
        nootrópicos. Pruébala directamente con tu combinación en{" "}
        <Link href="/compatibilidad" className="font-semibold text-primary underline underline-offset-2">
          la herramienta
        </Link>
        .
      </Callout>

      <H2>Cómo sacarle el máximo partido</H2>
      <UL>
        <LI>
          <strong>Revisa cada compuesto de tu stack por pares</strong>, no solo el más nuevo que vas a
          sumar. Si ya llevas 3 péptidos, hay 3 combinaciones que revisar, no solo la del recién
          llegado.
        </LI>
        <LI>
          <strong>Un &ldquo;sin datos&rdquo; no es luz verde ni luz roja</strong> — es la señal de que
          esa combinación en concreto no tiene literatura, y por lo tanto es tema para hablar con tu
          médico antes de asumir que es segura por descarte.
        </LI>
        <LI>
          <strong>Un &ldquo;evitar&rdquo; casi siempre es redundancia, no peligro extremo</strong> —
          normalmente significa que los dos compuestos hacen el mismo trabajo, así que sumarlos no
          multiplica el efecto, solo el costo.
        </LI>
        <LI>
          <strong>Guarda tu protocolo completo en un solo lugar</strong> para poder revisar cada par
          cuando agregues un compuesto nuevo, en vez de tener que recordar de memoria qué llevabas ya.
        </LI>
      </UL>

      <P>
        Si ya usas varios péptidos a la vez, en{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        puedes llevar todo el stack registrado — dosis, viales y protocolo — para revisarlo junto con
        la herramienta de compatibilidad cada vez que sumes algo nuevo.
      </P>
    </>
  );
}
