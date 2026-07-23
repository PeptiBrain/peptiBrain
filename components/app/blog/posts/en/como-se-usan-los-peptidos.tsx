import { Link } from "@/i18n/navigation";
import { H2, P, OL, OLItem, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        You already know what a peptide is and how to reconstitute it. What almost no one explains well is the
        day-to-day part: where to apply it, how often, and how to avoid always irritating the same spot.
      </P>

      <H2>The most common route: subcutaneous</H2>
      <P>
        The vast majority of vial peptides are applied subcutaneously — that is, into the fatty tissue just
        under the skin, not the muscle. It uses a short, thin needle (the same insulin syringe you already use
        to calculate the dose), and it&apos;s the route that usually causes the least discomfort.
      </P>

      <H2>Common sites and why to rotate them</H2>
      <P>
        The most used sites are the abdomen (a couple of fingers away from the navel), the outer thigh, and, to
        a lesser extent, the back of the arm. None is exclusively &ldquo;the right one&rdquo; — what matters is{" "}
        <strong>rotating them</strong>.
      </P>
      <P>
        Always injecting at the exact same spot can cause tissue hardening over time (known as
        lipohypertrophy), and makes that area absorb worse with each new application. Alternating between 3-4
        different spots, a couple of centimeters apart, is common practice.
      </P>

      <H2>The 4 basic steps of an application</H2>
      <OL>
        <OLItem n={1}>
          <strong>Wash your hands</strong> and disinfect the area with an alcohol swab. Let it dry before
          injecting.
        </OLItem>
        <OLItem n={2}>
          <strong>Load the syringe</strong> with the exact units that correspond to your dose (never by eye).
        </OLItem>
        <OLItem n={3}>
          <strong>Gently pinch the skin</strong> at the chosen site and insert the needle at a 90° angle, or 45°
          if you have little subcutaneous fat in that area.
        </OLItem>
        <OLItem n={4}>
          <strong>Press the plunger slowly</strong>, remove the needle, and dispose of it in a rigid container —
          never in the regular trash.
        </OLItem>
      </OL>

      <Callout>
        This is a general overview of how a subcutaneous peptide is administered, not personalized medical
        instruction. The exact technique and the suitability of any peptide must be indicated by a healthcare
        professional.
      </Callout>

      <H2>Consistency matters more than the exact time</H2>
      <P>
        For daily-dose peptides (like BPC-157), applying it at roughly the same time each day helps keep a
        steady rhythm. For weekly-dose ones (like semaglutide), it&apos;s common to pick a day of the week and stick
        with it — changing days occasionally isn&apos;t serious, but losing track of when the last dose was is.
      </P>
      <P>
        And that&apos;s where a record saves you headaches: if you run more than one peptide at a time, writing down
        each application (site, date, and dose) is the only way to not lose track. Our{" "}
        <Link href="/login" className="font-semibold text-primary underline underline-offset-2">
          app
        </Link>{" "}
        does it in seconds and reminds you when the next one is due.
      </P>
    </>
  );
}
