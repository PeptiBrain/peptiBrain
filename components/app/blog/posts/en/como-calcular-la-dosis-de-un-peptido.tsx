import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Converts mg to syringe units", values: [true, false] },
  { label: "Works for any peptide, not just one", values: [true, null] },
  { label: "Warns if you exceed 1 U100 syringe", values: [true, false] },
  { label: "Saves your vial for next time", values: [true, false] },
];

const FAQ_ITEMS = [
  {
    q: "Is the formula the same for every peptide?",
    a: "The mg-to-units conversion is the same formula for any peptide reconstituted from powder. What changes between compounds is the dose and schedule (some go up gradually, like GLP-1; others stay fixed). Ones that already come dissolved in oil, like testosterone (TRT), aren't reconstituted — you just calculate the vial's fixed concentration.",
  },
  {
    q: "What if I get the water I added to the vial wrong?",
    a: "The concentration changes, and with it the units that match your dose — even if the mg dose itself is correct. That's why it's worth writing down exactly how much water you used the first time and staying consistent every time you reconstitute that same peptide.",
  },
  {
    q: "Can I calculate this without a calculator?",
    a: "Yes, the formula is just two divisions and a multiplication — but redoing it by hand every time you switch vials or phases is where most errors slip in. A calculator does that math for you and flags results that aren't realistic.",
  },
  {
    q: "Does this tell me what dose I should use?",
    a: "No. The calculator and this guide convert a dose you already have (from your doctor or the protocol you follow) into syringe units — they don't decide or suggest how much you should inject.",
  },
];

export default function Post() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <P>
        If you searched &ldquo;how to calculate a peptide's dose&rdquo;, it's because you have a mg dose (from
        your doctor or the protocol you're following) and need to convert it into something you can actually
        draw into a syringe: units. The formula is the same for any peptide reconstituted from powder,
        whatever the compound.
      </P>

      <Summary>
        To calculate a peptide's dose: (1) find your vial's concentration (vial mg ÷ mL of bacteriostatic
        water added), (2) divide your mg dose by that concentration, and (3) multiply by 100 to get the units
        on a U100 syringe. Change the vial or the water, and you need to redo the math — even for the same
        compound and dose.
      </Summary>

      <H2>The formula, step by step</H2>
      <UL>
        <LI>
          <strong>1. Vial concentration</strong> — total vial mg ÷ mL of bacteriostatic water you added. A 5
          mg vial with 2 mL of water comes out to 2.5 mg/mL.
        </LI>
        <LI>
          <strong>2. Dose ÷ concentration</strong> — your mg dose divided by the concentration from step 1
          gives you the volume in mL you need.
        </LI>
        <LI>
          <strong>3. mL × 100 = units</strong> — on a U100 syringe, each mL equals 100 units. That's the
          number you actually see marked on the syringe.
        </LI>
      </UL>

      <H3>A real numeric example</H3>
      <P>
        A 5 mg vial reconstituted with 2 mL of water → 2.5 mg/mL concentration. If your dose is 0.5 mg:
        0.5 ÷ 2.5 = 0.2 mL → 0.2 × 100 = <strong>20 units</strong> on a U100 syringe.
      </P>

      <Callout>
        This formula doesn't decide your dose or titration schedule — your doctor or the protocol you're
        following does. What it does is the math conversion from mg to units, based on your specific vial's
        real concentration.
      </Callout>

      <H2>Why this changes depending on the peptide</H2>
      <P>
        Not every compound is calculated the same way. Peptides that come as powder (BPC-157, GHK-Cu, GLP-1
        like semaglutide or tirzepatide) need reconstitution before this calculation — if you don't yet know
        how to mix the vial with water, we have a{" "}
        <Link href="/blog/how-to-reconstitute-a-peptide" className="font-semibold text-primary underline underline-offset-2">
          step-by-step reconstitution guide
        </Link>
        . Testosterone (TRT), on the other hand, already comes dissolved in oil at a fixed concentration —
        it's not reconstituted, you just calculate the vial's concentration as it comes.
      </P>

      <H2>Use the free calculator</H2>
      <P>
        Instead of redoing this math by hand every time,{" "}
        <Link href="/reconstitution-calculator" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain's reconstitution calculator
        </Link>{" "}
        does the full conversion for any peptide — enter the vial mg, the water you added, and your dose, and
        it shows you the exact units with a syringe drawing. If your protocol is specifically GLP-1
        (semaglutide or tirzepatide) with its titration table, use the{" "}
        <Link href="/blog/glp1-dose-calculator" className="font-semibold text-primary underline underline-offset-2">
          GLP-1 dose calculator
        </Link>
        ; if it's TRT, the{" "}
        <Link href="/trt-calculator" className="font-semibold text-primary underline underline-offset-2">
          TRT calculator
        </Link>
        .
      </P>
      <AppComparisonTable
        columns={["Calculator", "By hand"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="Depends on the calculator you use — not a standard."
      />

      <H2>Frequently asked questions</H2>
      <UL>
        {FAQ_ITEMS.map((item) => (
          <LI key={item.q}>
            <strong>{item.q}</strong> — {item.a}
          </LI>
        ))}
      </UL>

      <P>
        If you've already calculated your dose and want to track every application,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        saves every injection and your full history in one place.
      </P>
    </>
  );
}
