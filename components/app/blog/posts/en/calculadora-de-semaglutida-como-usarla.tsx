import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Semaglutide and tirzepatide don't start at the maintenance dose — they're titrated up gradually
        over several weeks. That means the "how many units do I draw" calculation changes every month,
        not just once. So you don't have to redo it by hand at every phase, we built the{" "}
        <Link href="/calculadora-semaglutida" className="font-semibold text-primary underline underline-offset-2">
          Semaglutide & Tirzepatide Calculator
        </Link>
        .
      </P>

      <Summary label="In short:">
        Pick the compound, enter your vial's mg and the bacteriostatic water you added, and the
        calculator shows the full weekly titration table with the exact units to draw at every phase —
        from week one to the maintenance dose. What you see is the standard reference schedule, not a
        personalized adjustment: that's for your doctor to decide.
      </Summary>

      <H2>How it works</H2>
      <P>
        You pick the compound (semaglutide or tirzepatide), enter your vial's mg and the water you
        added, and the calculator sets the concentration. From there it builds a table: each row is a
        weekly phase, with its dose in mg and the units to draw on a U100 syringe for that phase. Tap a
        row to see that exact phase drawn on the syringe, so you don't have to translate the number
        yourself.
      </P>

      <H3>Semaglutide's reference schedule</H3>
      <P>
        The table the calculator uses steps up from 0.25 mg weekly for 4 weeks, then moves to 0.5 mg,
        1.0 mg, 1.7 mg, and up to a 2.4 mg maintenance dose, changing phase every 4 weeks. That's the
        general reference schedule — your doctor can adjust it to your specific case.
      </P>
      <H3>Tirzepatide's reference schedule</H3>
      <P>
        For tirzepatide, the reference schedule starts at 2.5 mg weekly and steps up every 4 weeks:
        5, 7.5, 10, 12.5, and up to a 15 mg maintenance dose. Same as with semaglutide, always per
        medical guidance.
      </P>

      <H2>Why titration exists (and why you shouldn't skip it)</H2>
      <P>
        Raising the dose gradually, instead of starting straight at the maintenance dose, is what
        reduces the digestive side effects these medications can cause at the start. The calculator
        doesn't decide which phase you're on or when to move up — that's set and supervised by your
        healthcare professional. What it does is translate the phase you're on into the exact units for
        your syringe, based on your vial's actual concentration.
      </P>

      <Callout>
        The calculator shows units, not milligrams, because on a syringe you draw volume, not weight. It
        converts each phase's mg into the exact U100 units using your specific vial's concentration —
        which can differ from someone else's vial even with the same compound.
      </Callout>

      <H2>How to get the most out of it</H2>
      <UL>
        <LI>
          <strong>Look at the full table before you start</strong>, not just the first row. Seeing the
          whole titration path at once helps you understand why the dose rises gradually and what to
          expect over the coming weeks.
        </LI>
        <LI>
          <strong>Recalculate if you switch vials or concentration.</strong> A new vial with a different
          amount of compound or different water added changes the concentration, and with it the units
          for every phase — even if it's the same compound.
        </LI>
        <LI>
          <strong>If the calculator warns you're over 1 U100 syringe (100 U)</strong>, don't force a
          second draw on your own — it's a sign you need more than one syringe or to adjust the
          concentration with your doctor.
        </LI>
        <LI>
          <strong>Use the table as a conversation reference, not a prescription.</strong> The schedule
          you see here is the standard reference; your actual phase, how fast you move up, and your
          final dose are decided by your doctor.
        </LI>
      </UL>

      <P>
        If you've already started your treatment and want to log every dose given alongside your
        titration phase,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        lets you save every injection and see your full history in one place.
      </P>
    </>
  );
}
