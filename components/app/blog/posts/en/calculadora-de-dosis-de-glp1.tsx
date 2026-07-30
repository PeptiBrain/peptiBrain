import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary, Sources } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Converts mg to syringe units automatically", values: [true, false] },
  { label: "Includes the full weekly titration table", values: [true, false] },
  { label: "Warns if the dose exceeds 1 U100 syringe", values: [true, false] },
  { label: "Works for semaglutide and tirzepatide", values: [true, false] },
  { label: "Free, no account needed", values: [true, null] },
];

const FAQ_ITEMS = [
  {
    q: "What is a GLP-1 medication?",
    a: "GLP-1 is the family of medications (semaglutide, tirzepatide, among others) that mimic a gut hormone to regulate appetite and blood sugar. They're also known by their brand names: Ozempic, Wegovy (semaglutide) and Mounjaro, Zepbound (tirzepatide).",
  },
  {
    q: "Is this GLP-1 dose calculator free?",
    a: "Yes, it's free and doesn't require creating an account to use.",
  },
  {
    q: "Do I need a prescription to calculate my dose?",
    a: "The calculator doesn't require or verify a prescription — it's a math conversion tool (mg to units), not a dispensing tool. Any GLP-1 treatment should be carried out under medical supervision.",
  },
  {
    q: "Does it work for Ozempic, Wegovy, Mounjaro, or Zepbound?",
    a: "Yes. The calculator works with the compound (semaglutide or tirzepatide), which is the same active ingredient behind those brand names.",
  },
  {
    q: "Can I save the record of doses I've already calculated?",
    a: "The calculator itself doesn't keep a history — it's for one-off use. If you want to track every dose you've given alongside your titration phase, PeptiBrain lets you save it all in one place.",
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
        If you searched &ldquo;GLP-1 dose calculator&rdquo;, it's because you need to convert the milligram
        dose of your semaglutide or tirzepatide into something you can actually draw into a syringe: units.
        And since the GLP-1 dose goes up every few weeks (titration), that math isn't a one-time thing — you
        have to redo it at every phase.
      </P>

      <Summary>
        A GLP-1 dose calculator converts your weekly mg dose into the exact units on a U100 syringe, based on
        your vial's real concentration (vial mg ÷ mL of bacteriostatic water added). PeptiBrain has a free
        one, no signup required, for both semaglutide and tirzepatide — with the full titration table built
        in.
      </Summary>

      <H2>What is a GLP-1 medication?</H2>
      <P>
        GLP-1 (short for glucagon-like peptide-1, a hormone the body itself produces) is the family of
        medications that includes semaglutide and tirzepatide — known commercially as Ozempic, Wegovy,
        Mounjaro, and Zepbound. They work by regulating appetite and blood sugar, and are given once a week
        as a subcutaneous injection.
      </P>

      <H2>Why the GLP-1 dose isn't a fixed number</H2>
      <P>
        These medications aren't started at the final dose — they're increased gradually over several weeks
        (titration), which reduces the digestive side effects that can show up early on. That means the mg
        dose changes every month, and with it, the units you need to draw into the syringe. Redoing that
        conversion by hand at every phase is where most errors slip in.
      </P>

      <H3>From milligrams to units: the exact math</H3>
      <P>
        Your vial's concentration is the total mg divided by the bacteriostatic water you added. With that
        concentration, the units to draw are your mg dose divided by the concentration, times 100 (the U100
        syringe scale). Change the vial or the water amount, and the concentration changes — even for the
        same compound and titration phase.
      </P>

      <Callout>
        The calculator doesn't decide your dose or which titration phase you're on — your doctor indicates
        and supervises that. What it does is the math conversion from mg to syringe units, based on your
        specific vial's real concentration.
      </Callout>

      <H2>Use the free GLP-1 dose calculator</H2>
      <P>
        Pick the compound (semaglutide or tirzepatide), enter your vial's mg and the bacteriostatic water you
        added, and{" "}
        <Link href="/calculadora-semaglutida" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain's GLP-1 calculator
        </Link>{" "}
        shows you the full weekly titration table with the exact units to draw at every phase — with a
        warning if you exceed a U100 syringe's capacity.
      </P>
      <AppComparisonTable
        columns={["GLP-1 calculator", "By hand"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="Depends on the calculator or spreadsheet you use — not a standard."
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
        If you've already started treatment and want to track every dose you've given alongside your
        titration phase,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        lets you save every injection and see your full history in one place.
      </P>

      <Sources
        label="Sources"
        items={[
          {
            title: "Tirzepatide Once Weekly for the Treatment of Obesity — SURMOUNT-1 (New England Journal of Medicine)",
            url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038",
          },
          {
            title: "Two-year effects of semaglutide in adults with overweight or obesity — STEP 5 trial",
            url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9556320/",
          },
        ]}
      />
    </>
  );
}
