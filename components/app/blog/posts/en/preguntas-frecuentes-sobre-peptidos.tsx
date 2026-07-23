import { Link } from "@/i18n/navigation";
import { H2, P, Callout } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";

const FAQ_ITEMS = [
  {
    q: "Are peptides legal?",
    a: "It depends on the peptide and the country. Some (insulin, semaglutide, tirzepatide) are approved as medications. Most “research peptides” aren't, and are sold under a “research use only” label.",
  },
  {
    q: "Are they safe?",
    a: "There's no single answer. An approved peptide prescribed by a doctor has a known safety profile. A research peptide bought online has uncertain purity and limited human data. Always talk to a healthcare professional.",
  },
  {
    q: "Will I see fast results?",
    a: "It depends on the goal. GLP-1s show weight changes within weeks. Recovery peptides (BPC-157, TB-500) act gradually. Cosmetic peptides (GHK-Cu) take months. Don't expect extreme transformations.",
  },
  {
    q: "Do I need blood work?",
    a: "Recommended, especially before and during the use of peptides that affect hormones (GH, GLP-1, thyroid). A basic panel + glucose/HbA1c + liver profile is a good starting point.",
  },
  {
    q: "Can I combine several peptides (a stack)?",
    a: "Yes — many protocols actually combine peptides with complementary roles (e.g. BPC-157 + TB-500 for recovery). Always start with one at a time so you know your own response before adding more.",
  },
  {
    q: "Are they only given by injection?",
    a: "Most are, because the stomach breaks peptides down. Oral, nasal, or topical versions exist for some (oral BPC-157, nasal PT-141, topical GHK-Cu), but subcutaneous remains the most common route.",
  },
  {
    q: "How long do the effects last after stopping?",
    a: "It depends. The metabolic effects of GLP-1s reverse within weeks if habits don't change. BPC-157's regenerative effect on tissue that's already healed tends to stick. Cosmetic effects need upkeep.",
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

      <P>The questions that keep coming up, answered clearly and without overselling anything.</P>

      {FAQ_ITEMS.map((item) => (
        <div key={item.q}>
          <H2>{item.q}</H2>
          <P>{item.a}</P>
        </div>
      ))}

      <Callout>
        This guide is educational, not medical advice. Before starting, changing, or stopping any peptide, talk to a
        healthcare professional.
      </Callout>

      <H2>What&apos;s next?</H2>
      <P>
        If you&apos;re still not sure where to start, our{" "}
        <Link href="/blog/que-son-los-peptidos" className="font-semibold text-primary underline underline-offset-2">
          basic peptide guide
        </Link>{" "}
        is a good place to begin. And if you already know which one you&apos;re interested in, our{" "}
        <Link href="/protocolos" className="font-semibold text-primary underline underline-offset-2">
          reference protocols
        </Link>{" "}
        page has typical dose and frequency, with direct access to the calculator.
      </P>
    </>
  );
}
