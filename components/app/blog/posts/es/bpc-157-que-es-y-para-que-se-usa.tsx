import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Dentro de la comunidad de recuperación y rendimiento, pocos nombres se repiten tanto como el BPC-157.
        Vamos a ver qué es realmente y qué dice — y qué no dice — la investigación disponible.
      </P>

      <H2>¿Qué es el BPC-157?</H2>
      <P>
        BPC-157 es un pentadecapéptido (una cadena de 15 aminoácidos) derivado de una proteína que se encuentra
        de forma natural en el jugo gástrico. De ahí viene su nombre completo, &ldquo;Body Protection Compound-157&rdquo;.
        Se ha investigado principalmente por su posible papel en la reparación de tejidos.
      </P>

      <H2>Qué se investiga sobre él</H2>
      <P>Las áreas donde más se menciona en la literatura y en la comunidad son:</P>
      <UL>
        <LI><strong>Reparación tisular</strong> — tendones, ligamentos y músculo.</LI>
        <LI><strong>Salud digestiva</strong> — coherente con su origen gástrico.</LI>
        <LI><strong>Recuperación tras lesión</strong> — es uno de los motivos por los que se popularizó en el mundo del deporte y el gimnasio.</LI>
      </UL>
      <Callout>
        La mayor parte de la evidencia disponible sobre BPC-157 proviene de estudios preclínicos (en modelos
        animales). Eso no invalida el interés científico, pero sí significa que no hay el mismo nivel de
        evidencia clínica en humanos que con moléculas aprobadas como medicamento.
      </Callout>

      <H2>Cómo se administra habitualmente</H2>
      <P>
        En la comunidad, el protocolo de referencia suele rondar los 250 mcg, una o dos veces al día, vía
        subcutánea. Un vial típico viene en 5 mg, y se reconstituye con unos 3 mL de agua bacteriostática — pero
        estos números son solo una referencia de lo que circula habitualmente, no una indicación médica.
      </P>

      <H2>Lo que suele confundir a quien empieza</H2>
      <P>
        Dos cosas generan la mayoría de las dudas: primero, la unidad — los viales de BPC-157 suelen venir en
        mcg, no en mg, y confundir ambas unidades multiplica el error por mil. Segundo, la frecuencia — al ser
        una dosis diaria (no semanal, como los GLP-1), es fácil perder la cuenta de si ya se aplicó hoy o no si
        no se lleva un registro.
      </P>
      <P>
        Por eso, para un péptido de uso diario como este, tiene aún más sentido llevar un registro de cada
        aplicación — en{" "}
        <Link href="/protocolos" className="font-semibold text-primary underline underline-offset-2">
          nuestra guía de protocolos de referencia
        </Link>{" "}
        puedes ver los valores típicos y calcular tu dosis con un clic.
      </P>
    </>
  );
}
