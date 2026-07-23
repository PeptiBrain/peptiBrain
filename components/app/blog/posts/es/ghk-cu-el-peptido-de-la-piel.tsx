import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Si te interesa el cuidado de la piel más allá de las cremas de siempre, seguro te has topado con el
        GHK-Cu. Es uno de los pocos péptidos que además tiene presencia real en cosmética comercial, no solo en
        foros de biohacking.
      </P>

      <H2>¿Qué es el GHK-Cu?</H2>
      <P>
        GHK-Cu es un tripéptido (tres aminoácidos) unido a un ion de cobre — de ahí el &ldquo;Cu&rdquo; en su nombre (símbolo
        químico del cobre). Se encuentra de forma natural en el plasma humano, la saliva y la orina, y su
        concentración disminuye con la edad, lo que ha alimentado el interés por su papel en el envejecimiento
        de la piel.
      </P>

      <H2>Qué se investiga sobre él</H2>
      <UL>
        <LI><strong>Producción de colágeno</strong> — es su asociación más conocida.</LI>
        <LI><strong>Regeneración cutánea</strong> — se ha estudiado en el contexto de cicatrización de heridas.</LI>
        <LI><strong>Antioxidante</strong> — el complejo cobre-péptido tiene actividad relacionada con el estrés oxidativo.</LI>
        <LI><strong>Salud capilar</strong> — es un área de interés más reciente, aún con menos respaldo que la piel.</LI>
      </UL>
      <Callout>
        A diferencia de otros péptidos de esta lista, el GHK-Cu tiene un historial más largo en aplicaciones
        tópicas (cremas, serums) además de la vía inyectable, lo que explica su presencia en cosmética.
      </Callout>

      <H2>Vía tópica vs. inyectable</H2>
      <P>
        Es importante distinguir entre las dos formas en que aparece: en cosmética, suele venir formulado en
        serums o cremas para aplicación directa sobre la piel. En el uso que circula en comunidades de
        biohacking, en cambio, se maneja como vial para reconstituir e inyectar, igual que otros péptidos de
        este blog — y ese es el uso al que aplican los mismos cuidados de reconstitución y dosis.
      </P>

      <H2>Si vas a reconstituirlo</H2>
      <P>
        Las mismas reglas de siempre aplican: calcular bien la concentración según los mg del vial y el agua
        añadida, guardarlo en frío una vez reconstituido, y no perder de vista cuánto tiempo lleva abierto el
        vial. Nuestra{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          calculadora de reconstitución
        </Link>{" "}
        sirve exactamente igual para GHK-Cu que para cualquier otro péptido en vial.
      </P>
    </>
  );
}
