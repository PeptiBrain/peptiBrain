import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        When you're deciding between two peptides, looking each one up separately across different
        sources and building the comparison yourself is slow and easy to get wrong. The{" "}
        <Link href="/peptide-comparator" className="font-semibold text-primary underline underline-offset-2">
          Peptide Comparator
        </Link>{" "}
        puts both side by side, field by field, on a single screen.
      </P>

      <Summary label="In short:">
        You pick two peptides and see, side by side, their route of administration, common dose,
        frequency, vial size, bacteriostatic water, categories, what it's used for, how it works, the
        most-reported effects, evidence level, common side effects, and what it combines with or should
        avoid. These are the same reference values used elsewhere in the app — information to
        understand the differences, not a recommendation of which one to pick.
      </Summary>

      <H2>How it works</H2>
      <P>
        You pick a peptide A and a peptide B from the list, and the tool automatically builds a
        comparison table with these fields:
      </P>
      <UL>
        <LI>
          <strong>Route of administration</strong> — how each one is applied.
        </LI>
        <LI>
          <strong>Common dose and frequency</strong> — the usual reference values for each peptide.
        </LI>
        <LI>
          <strong>Vial and bacteriostatic water</strong> — the typical vial size and how much water is
          used to reconstitute it.
        </LI>
        <LI>
          <strong>Categories and description</strong> — what group each one falls under and what it is,
          in a few words.
        </LI>
        <LI>
          <strong>How it works and the most-reported effects</strong> — the mechanism and the effects the
          community mentions most often.
        </LI>
        <LI>
          <strong>Evidence level and common side effects</strong> — so you don't lose track of how well
          supported each piece of information is.
        </LI>
        <LI>
          <strong>Combines with / avoid</strong> — which other compounds are commonly mentioned alongside
          this one.
        </LI>
      </UL>

      <H3>Where the data comes from</H3>
      <P>
        These are the same reference values (common dose, frequency, vial, bacteriostatic water) we use
        in each peptide's individual profile inside PeptiBrain — public information gathered from the
        same source the rest of the app already uses, not a separate figure invented just for the
        comparator.
      </P>

      <Callout>
        This comparison is informational and educational. Deciding which peptide to use, at what dose,
        and under what circumstances is always up to a healthcare professional — the comparator doesn't
        recommend one over the other, it just puts the data side by side.
      </Callout>

      <H2>How to get the most out of it</H2>
      <UL>
        <LI>
          <strong>Start with the field that matters most to you</strong>, not the order the table
          displays it in. If route of administration or frequency is your priority, go straight there
          instead of reading top to bottom.
        </LI>
        <LI>
          <strong>Use the evidence level as a reading filter</strong>, not a verdict. A field with less
          evidence behind it isn't false — it's a signal to dig deeper before drawing conclusions.
        </LI>
        <LI>
          <strong>Check "combines with / avoid" against your own protocol</strong>, not just against the
          other peptide in the comparison. If you're already using a third compound, that combination
          won't show up here — that's what the compatibility tool is for.
        </LI>
        <LI>
          <strong>Try a few popular comparisons</strong> before settling on one pair — sometimes the
          relevant difference shows up when you compare a third candidate you hadn't considered.
        </LI>
      </UL>

      <P>
        If, after comparing, you already know which peptide you want to use,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        lets you calculate its exact dose and log every application from day one.
      </P>
    </>
  );
}
