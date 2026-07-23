import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Un péptido bien calculado pero mal almacenado pierde eficacia igual — y a veces pasa desapercibido
        porque no huele ni cambia de aspecto de forma obvia. Estas son las reglas básicas de almacenamiento,
        antes y después de reconstituir.
      </P>

      <H2>Antes de reconstituir (polvo liofilizado)</H2>
      <P>
        En polvo, sin reconstituir, la mayoría de péptidos son bastante estables si se guardan bien:
      </P>
      <UL>
        <LI><strong>Nevera o congelador</strong>, según indique el proveedor — muchos aguantan meses o incluso años sin abrir, en frío.</LI>
        <LI><strong>Protegido de la luz</strong> — la luz directa degrada la estructura del péptido con el tiempo; el vial original suele venir ya en cristal oscuro por esta razón.</LI>
        <LI><strong>Sellado</strong> — no lo abras hasta que vayas a reconstituirlo.</LI>
      </UL>

      <H2>Después de reconstituir</H2>
      <P>
        Aquí cambian las reglas: una vez que el péptido está mezclado con agua bacteriostática, se vuelve mucho
        más sensible.
      </P>
      <UL>
        <LI><strong>Siempre en nevera</strong> (no en el congelador — congelar un vial ya reconstituido puede dañar la estructura del péptido).</LI>
        <LI><strong>Vida útil limitada</strong> — la referencia habitual en la comunidad es de unos 30 días en frío, aunque varía según el péptido concreto.</LI>
        <LI><strong>Fuera de la luz directa</strong> — guárdalo en su caja o envuelto, no en la puerta de la nevera donde recibe luz cada vez que se abre.</LI>
      </UL>

      <Callout>
        Si el líquido se ve turbio, cambia de color o aparecen partículas, descarta el vial aunque no haya
        pasado el tiempo de referencia — es señal de que algo salió mal.
      </Callout>

      <H2>El enemigo número uno: el calor</H2>
      <P>
        Dejar un vial en un coche al sol, cerca de una ventana o en una bolsa de viaje sin refrigerar durante
        horas puede degradarlo mucho más rápido que cualquier otro factor. Si viajas, usa una bolsa térmica con
        un acumulador de frío — es la forma más simple de mantener la cadena de frío fuera de casa.
      </P>

      <H2>Cómo no perder la cuenta</H2>
      <P>
        El problema más común no es no saber la regla, sino olvidar cuándo abriste cada vial. Anotar la fecha de
        reconstitución de cada uno (a mano o en una app) es lo único que te permite saber, de un vistazo, cuáles
        siguen en buen estado y cuáles ya deberías descartar.
      </P>
      <P>
        Nuestra app avisa automáticamente cuándo un vial está por caducar — puedes ver cómo funciona en la{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          página principal de PeptiBrain
        </Link>
        .
      </P>
    </>
  );
}
