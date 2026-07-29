import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Comparar precios de péptidos entre proveedores es engañoso si solo miras el precio del vial —
        un vial más caro con más mg puede salir más barato por dosis que uno barato con poco contenido.
        La{" "}
        <Link href="/calculadora-costo-mg" className="font-semibold text-primary underline underline-offset-2">
          Calculadora de costo por mg
        </Link>{" "}
        hace esa cuenta por ti.
      </P>

      <Summary>
        Metes el precio que pagaste y el contenido del vial en mg, y la calculadora te dice cuánto te
        cuesta cada mg — y, si además indicas tu dosis, cuánto te cuesta cada dosis aplicada. No
        convierte monedas: solo divide el precio entre el contenido, en la moneda que tú metas. Es una
        forma de comparar eficiencia de costo, no una recomendación de dónde comprar.
      </Summary>

      <H2>Cómo funciona</H2>
      <P>
        Tres campos, dos resultados:
      </P>
      <UL>
        <LI>
          <strong>Precio pagado.</strong> Lo que costó el vial, en la moneda que uses.
        </LI>
        <LI>
          <strong>Contenido del vial (mg).</strong> Cuántos mg de péptido trae ese vial — puedes elegir
          un péptido de la lista para que se autocomplete, o meterlo tú manualmente.
        </LI>
        <LI>
          <strong>Tu dosis (mg), opcional.</strong> Si la agregas, la calculadora te da además el costo
          de cada dosis aplicada, no solo el costo por mg.
        </LI>
      </UL>
      <P>
        Con el precio y el contenido, la calculadora divide uno entre otro y te da el costo por mg. Si
        agregaste tu dosis, multiplica ese costo por mg por tu dosis y te da el costo por aplicación —
        el número que de verdad importa cuando comparas cuánto te cuesta tu protocolo mes a mes.
      </P>

      <H3>Por qué no hay conversión de moneda</H3>
      <P>
        El cálculo es en la moneda que tú metas — la calculadora solo divide el precio entre el
        contenido del vial, sin convertir nada. Si comparas un proveedor en una moneda y otro en otra,
        conviértelos tú antes de meter el precio para que la comparación sea justa.
      </P>
      <H3>Por qué no todos los péptidos aparecen en el selector</H3>
      <P>
        Solo se incluyen los péptidos que se dosifican en mg. Los que se dosifican en UI (como la
        hormona de crecimiento) no comparten la misma unidad de costo, así que no aplican en esta
        calculadora en particular.
      </P>

      <Callout>
        Un vial más caro no siempre es más caro por dosis. Dos viales del mismo péptido con distinto
        contenido y distinto precio pueden dar un costo por mg muy diferente — la única forma de
        comparar de verdad es hacer esta división, no mirar el precio de etiqueta.
      </Callout>

      <H2>Cómo sacarle el máximo partido</H2>
      <UL>
        <LI>
          <strong>Compara el costo por mg entre proveedores, no el precio del vial.</strong> Es el
          único número que iguala viales de distinto tamaño y te dice de verdad cuál sale más
          conveniente.
        </LI>
        <LI>
          <strong>Agrega tu dosis real para ver el costo por aplicación</strong>, no solo por mg — es el
          número que te dice cuánto te va a costar tu protocolo completo, no solo el vial suelto.
        </LI>
        <LI>
          <strong>Guarda cada cálculo cuando cambies de proveedor</strong>, para poder comparar el
          proveedor nuevo contra el anterior con los mismos criterios, no de memoria.
        </LI>
        <LI>
          <strong>Úsala como comparación de eficiencia, no como consejo de compra.</strong> El resultado
          te dice qué opción es más barata por mg — la decisión de qué proveedor o qué producto usar
          sigue siendo tuya.
        </LI>
      </UL>

      <P>
        Si ya sabes qué péptido vas a usar y quieres llevar también el registro de tus dosis reales,
        en{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        puedes calcular su volumen exacto y guardar cada aplicación desde el primer día.
      </P>
    </>
  );
}
