import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, OL, OLItem, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Reconstituting a peptide means mixing the freeze-dried powder in the vial with bacteriostatic
        water so it can be injected. Mixing it isn't the hard part — once it's mixed, every single dose
        depends on a calculation you have to get right every time. That's why we built the{" "}
        <Link href="/reconstitution-calculator" className="font-semibold text-primary underline underline-offset-2">
          Reconstitution Calculator
        </Link>
        .
      </P>

      <Summary label="In short:">
        Enter your vial's mg (or mcg), the bacteriostatic water you added, and the dose you want to
        give, and the calculator returns the exact units to draw on your insulin syringe (U30, U50, or
        U100), with a syringe drawing and a print/save-to-PDF button. The dose itself comes from your
        protocol or your doctor — the tool just does the arithmetic.
      </Summary>

      <H2>How it works</H2>
      <P>The calculator asks for three inputs and works out everything else from there:</P>
      <OL>
        <OLItem n={1}>
          <strong>Vial amount.</strong> The mg or mcg of peptide the vial contains (it arrives
          freeze-dried, as a powder).
        </OLItem>
        <OLItem n={2}>
          <strong>Bacteriostatic water added.</strong> How many milliliters of water you added to the
          vial.
        </OLItem>
        <OLItem n={3}>
          <strong>Desired dose and syringe type.</strong> The dose you want to give, and whether your
          insulin syringe is U30, U50, or U100 (the most common one).
        </OLItem>
      </OL>
      <P>
        With those three numbers, the calculator tells you exactly which unit mark on the syringe to
        draw up to, with a visual drawing so you don't have to translate numbers into syringe lines
        yourself. If the dose you asked for exceeds the capacity of the syringe you picked, it warns you
        instead of giving you an impossible-to-draw result — and there are two ways out: a bigger
        syringe, or more bacteriostatic water (which lowers concentration and raises the volume per
        dose).
      </P>

      <H3>The math behind it, in plain terms</H3>
      <P>
        You don't need to memorize the formula, but understanding it helps you trust the result. First,
        the vial's mg divided by the mL of water you added gives you the concentration (mg per mL).
        Then, your dose divided by that concentration, times 100, gives you the units to draw on a U100
        syringe — because on a U100 insulin syringe, 100 units equal 1 mL. Switching syringe type (U30,
        U50) only changes the scale of the lines, not the underlying math.
      </P>

      <Callout>
        Reconstituting the same vial with more or less water doesn't change the total amount of peptide
        you have — it changes how many units you need to draw to reach the same dose. More water = more
        diluted = more units per dose (but also more room to measure precisely on smaller syringes).
      </Callout>

      <H2>How to get the most out of it</H2>
      <UL>
        <LI>
          <strong>Always use the same amount of water for the same vial.</strong> If you reconstitute
          today with 2 mL and next time with 3 mL "because you didn't remember," the concentration
          changes and the units you used before no longer match the same dose.
        </LI>
        <LI>
          <strong>Confirm the syringe type before reading the result.</strong> Units on a U30 and a U50
          look different on the syringe itself — picking the right type in the calculator is what makes
          the drawing match what you're actually holding.
        </LI>
        <LI>
          <strong>Save or print the result the first time you reconstitute a new vial.</strong> The
          print/PDF button exists exactly so you don't have to redo the math every week for the same
          vial.
        </LI>
        <LI>
          <strong>If you switch vials or concentration, recalculate from scratch.</strong> Don't reuse
          the previous vial's units — a new vial with a different amount of peptide or different water
          added changes the concentration, even if it's the same peptide.
        </LI>
      </UL>

      <P>
        If you also want to keep a history of every vial you reconstitute, with dose reminders and a
        log that doesn't depend on memory,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        lets you save each calculation alongside your actual injections.
      </P>
    </>
  );
}
