import { Link } from "@/i18n/navigation";
import { H2, P, OL, OLItem, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        After covering what peptides are, how to reconstitute them, and the most searched-for ones by goal,
        it&apos;s time for the most practical part: the mistakes that keep repeating among beginners — and how to
        avoid them.
      </P>

      <H2>The 7 most common mistakes</H2>
      <OL>
        <OLItem n={1}>
          <strong>Eyeballing the dose.</strong> Converting milligrams to syringe units in your head is where
          most mistakes slip in, especially with different vials that have different concentrations.
        </OLItem>
        <OLItem n={2}>
          <strong>Changing the water amount every time.</strong> If one day you use 2 mL and another 3 mL for
          the same peptide, the concentration changes and your previous calculation no longer applies.
        </OLItem>
        <OLItem n={3}>
          <strong>Not writing down the reconstitution date.</strong> Without that, it&apos;s impossible to know when
          the mixed vial expires — and using an expired vial isn&apos;t the same as using a freshly reconstituted
          one.
        </OLItem>
        <OLItem n={4}>
          <strong>Confusing mg with mcg.</strong> It&apos;s a unit error, not a quantity one — and it multiplies or
          divides the result by a thousand. It happens especially with peptides like BPC-157, whose doses are
          handled in mcg.
        </OLItem>
        <OLItem n={5}>
          <strong>Keeping no record at all.</strong> Without writing down what you applied and when, it&apos;s
          impossible to know whether something is working, whether you missed a dose, or how much you&apos;ve
          invested.
        </OLItem>
        <OLItem n={6}>
          <strong>Buying a bigger vial &ldquo;to save money&rdquo; without calculating your usage pace.</strong> If
          the vial expires before you have time to use it up at your dosing pace, you end up throwing product
          away — the opposite of saving.
        </OLItem>
        <OLItem n={7}>
          <strong>Raising the dose out of impatience.</strong> Gradual titration schedules (like semaglutide&apos;s)
          exist for a reason: skipping them increases the risk of side effects with no real benefit.
        </OLItem>
      </OL>

      <Callout>
        Almost all of these mistakes share the same underlying fix: stop calculating and recording from memory,
        and start relying on a tool that does it for you.
      </Callout>

      <H2>How to avoid them, in practice</H2>
      <P>
        Always use a{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          reconstitution calculator
        </Link>{" "}
        instead of calculating by hand, write down the date you open each vial, and keep a record of every dose
        applied — even if it&apos;s just a note on your phone. If you already use several peptides at once, an app
        dedicated to this (like PeptiBrain) saves you from exactly these seven mistakes with no extra effort.
      </P>
    </>
  );
}
