import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Automatic dose calculator", values: [false, false, true] },
  { label: "Reminder for the next application", values: [false, null, true] },
  { label: "Vial expiration tracking", values: [false, false, true] },
  { label: "Searchable history over time", values: [false, true, true] },
  { label: "Report ready for your doctor", values: [false, false, true] },
  { label: "Nothing to install", values: [true, true, null] },
];

const FAQ_ITEMS = [
  {
    q: "Isn't a spreadsheet enough?",
    a: "For one or two peptides with a fixed dose, it might be. The problem shows up with titration (the dose changes every few weeks), with more than one compound at a time, or when you need an organized report for your doctor — that's where a spreadsheet becomes constant manual work.",
  },
  {
    q: "What's the difference between this and comparing specific peptide apps?",
    a: "This guide compares categories of tools (notes, spreadsheet, dedicated app). If you've already decided you want an app built for this and want to see which one to pick, we have a specific comparison between the most-used apps.",
  },
  {
    q: "Can I start with notes and switch later?",
    a: "Yes, that's common. Many people start with scattered notes the first few weeks and migrate to a dedicated tool once the protocol gets more complex (more compounds, titration, or needing to share tracking with a partner or doctor).",
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
        Before deciding which peptide app to use, it's worth stepping back: do you actually need an app, or
        is what you already have enough? We compare the three most common ways to keep track — scattered
        notes, a spreadsheet you build yourself, and a dedicated tool — honestly about when each one falls
        short.
      </P>

      <Summary>
        Notes and spreadsheets work well at the start, with a single peptide and a fixed dose. They fall
        short once there's titration (the dose goes up every few weeks), more than one compound at a time, or
        you need an organized report for your doctor — that's where a dedicated tool, with a built-in
        calculator and reminders, saves real time.
      </Summary>

      <H2>Scattered phone notes</H2>
      <P>
        The fastest way to start — no install, no need to think about organizing it. The problem: it doesn't
        calculate anything for you (you do every dose by hand), doesn't remind you when the next application
        is due, and after a few weeks it becomes hard to find what you logged on a given day.
      </P>

      <H2>A spreadsheet (Excel or Google Sheets)</H2>
      <P>
        A more structured step — you can build your own columns for date, dose, and notes. But you have to
        build it yourself from scratch, it doesn't automatically calculate syringe units from your vial's
        concentration, and it doesn't remind you of anything — it entirely depends on you remembering to open
        it.
      </P>

      <H2>A dedicated tracking tool</H2>
      <P>
        The real difference is what it does for you without being asked: automatically calculates the mg-to-
        syringe-unit conversion, reminds you of the next dose, warns when a vial is running out, and builds a
        history you can bring straight to your doctor's appointment.
      </P>

      <AppComparisonTable
        columns={["Scattered notes", "Spreadsheet", "Dedicated app"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="Depends on how you build it yourself — not included out of the box."
      />

      <H2>Which one fits you?</H2>
      <UL>
        <LI>
          <strong>A single peptide, fixed dose, short protocol</strong> — scattered notes or a simple
          spreadsheet can work just fine.
        </LI>
        <LI>
          <strong>Titration (the dose goes up every few weeks)</strong> — a tool with a built-in calculator
          saves you from redoing the math by hand at every phase.
        </LI>
        <LI>
          <strong>More than one compound at a time, or a long protocol</strong> — a searchable history and a
          doctor-ready report stop being a nice-to-have and become what you actually need.
        </LI>
      </UL>

      <Callout>
        None of these options decide your dose for you — your doctor always indicates and supervises that.
        The difference between them is only how much manual work they save you in organizing what you already
        decided.
      </Callout>

      <H2>Frequently asked questions</H2>
      <UL>
        {FAQ_ITEMS.map((item) => (
          <LI key={item.q}>
            <strong>{item.q}</strong> — {item.a}
          </LI>
        ))}
      </UL>

      <P>
        If you've already decided you want an app built specifically for peptides, we have a{" "}
        <Link href="/blog/mejores-apps-de-peptidos" className="font-semibold text-primary underline underline-offset-2">
          comparison between the most-used ones
        </Link>
        , including where{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        fits and where it doesn't.
      </P>
    </>
  );
}
