import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Automatic dose calculator", values: [true, false] },
  { label: "Reminder for the next application", values: [true, false] },
  { label: "Vial expiration tracking", values: [true, false] },
  { label: "Full, searchable history", values: [true, false] },
  { label: "Report ready for your doctor", values: [true, false] },
  { label: "Share with your family", values: [true, false] },
  { label: "Everything in one place", values: [true, false] },
];

const FAQ_ITEMS = [
  {
    q: "Is PeptiBrain free?",
    a: "Yes, it has a real free plan (not just a trial) for one peptide and one active vial. Paid plans add unlimited peptides, full calculators, an AI assistant, and more.",
  },
  {
    q: "Do I need a prescription or medical follow-up to use PeptiBrain?",
    a: "PeptiBrain doesn't require or verify a prescription — it's an organization tool, not a dispensing one. But any peptide, GLP-1, or TRT protocol should always be carried out under medical supervision, with or without the app.",
  },
  {
    q: "Is it only for GLP-1, or also for TRT and other peptides?",
    a: "It works for all three: recovery and cosmetic peptides, GLP-1 (semaglutide, tirzepatide), and TRT — each with its own calculators and logging fields.",
  },
  {
    q: "Is it available in Spanish?",
    a: "Yes, in real Spanish (not a half-translation) and also in English, with automatic language detection based on your country.",
  },
  {
    q: "Is my information safe?",
    a: "Your data is tied to your account, with row-level access control (RLS) in the database — no one else sees your protocol unless you explicitly share access (Family plan).",
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
        If you searched &ldquo;what is PeptiBrain&rdquo; to understand what it&apos;s about before creating an
        account, this is the complete guide. No fluff: what it is, who it&apos;s for, how your day-to-day changes
        once you use it, and absolutely everything it includes — so you can decide with real information, not a
        one-line marketing tagline.
      </P>

      <Summary label="In short:">
        PeptiBrain is a web app for tracking your doses, vials, and peptide, GLP-1, or TRT protocol in one
        place — calculators, history, reminders, health tracking, and a report ready for your doctor. It
        doesn&apos;t decide your dose or replace a medical consultation: it organizes and calculates what your
        protocol already specifies.
      </Summary>

      <H2>What exactly is PeptiBrain?</H2>
      <P>
        PeptiBrain is a tracking app (not a store, not a forum, not a medical practice) built for a very
        specific situation: you&apos;re following a peptide protocol, a GLP-1 protocol (semaglutide,
        tirzepatide), or testosterone replacement therapy (TRT), and you need one single place where every
        vial, every dose, and every relevant data point gets logged — without relying on scattered phone
        notes, a notebook, or memory.
      </P>
      <P>
        Unlike most apps of this kind, which only exist in English, PeptiBrain was built with the
        Spanish-speaking community in mind from day one — the interface, the assistant, and support are all in
        real Spanish, not a half-translated afterthought — while remaining fully available in English too.
      </P>

      <H2>Who is PeptiBrain for? (our typical user)</H2>
      <P>
        You don&apos;t need to fit one single profile — PeptiBrain serves several different situations that
        share the same underlying problem: keeping track of a protocol without losing the thread.
      </P>
      <UL>
        <LI>
          <strong>You&apos;re on a GLP-1 treatment</strong> (semaglutide, tirzepatide) for weight loss and need
          to track the weekly titration, your weight, and your side effects without getting lost between
          phases.
        </LI>
        <LI>
          <strong>You&apos;re following a recovery or cosmetic peptide protocol</strong> (BPC-157, TB-500,
          GHK-Cu) and want to calculate reconstitution correctly and never miss an application.
        </LI>
        <LI>
          <strong>You&apos;re on TRT</strong> and need to stay consistent with the interval between
          injections, since it directly affects how your blood work gets interpreted.
        </LI>
        <LI>
          <strong>You track someone else&apos;s protocol too</strong> (a partner, a family member) alongside
          your own, and want to organize everything from one account with the Family plan.
        </LI>
        <LI>
          <strong>You already use an app like this, but it&apos;s only in English</strong> and want something
          built for you from the ground up.
        </LI>
      </UL>

      <H2>The problem: what daily life looked like before PeptiBrain</H2>
      <P>
        The reason PeptiBrain exists is always the same story, told a thousand different ways: notes about the
        last dose scattered across the phone&apos;s notes app, a photo of the vial, and memory. Calculating
        units to draw by hand every week, with the phone&apos;s calculator, never quite sure you got it right.
        Not knowing whether yesterday was the day. And showing up at the doctor&apos;s appointment trying to
        reconstruct a month of doses, weight, and symptoms from memory — walking away feeling like you forgot
        exactly the detail that mattered.
      </P>

      <H2>After PeptiBrain: how your day-to-day changes</H2>
      <P>
        With the protocol already set up, logging a dose takes seconds from your phone. The app already knows
        which peptide is due today, calculates the units on its own based on your vial&apos;s concentration, and
        warns you as an open vial approaches its expiration. Your streak of consecutive days tracks itself. And
        when your appointment comes, you&apos;re not relying on memory — you bring a report generated in
        seconds, with your adherence, your weight trend, and your side effects.
      </P>
      <Callout>
        None of this replaces your doctor or decides your dose: PeptiBrain organizes and calculates what your
        protocol already specifies — the medical decision always remains your healthcare professional&apos;s.
      </Callout>

      <H3>Before and after, at a glance</H3>
      <AppComparisonTable
        columns={["PeptiBrain", "Notes or paper"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="No equivalent data — doesn't apply to this method."
      />

      <H2>Everything PeptiBrain includes</H2>
      <H3>Protocol logging and calculations</H3>
      <UL>
        <LI>Dose, vial, and full protocol logging, with a history of everything applied.</LI>
        <LI>Reconstitution calculator (mg + bacteriostatic water → syringe units).</LI>
        <LI>Semaglutide and tirzepatide calculator with the full titration table.</LI>
        <LI>TRT dose calculator (mg, mL, and units based on concentration and frequency).</LI>
        <LI>Vial tracking: how much is left and when it expires.</LI>
      </UL>
      <H3>Free tools (no signup)</H3>
      <UL>
        <LI>
          <Link href="/comparador" className="font-semibold text-primary underline underline-offset-2">
            Peptide comparator
          </Link>{" "}
          side by side.
        </LI>
        <LI>
          <Link href="/compatibilidad" className="font-semibold text-primary underline underline-offset-2">
            Stack compatibility
          </Link>{" "}
          — whether two compounds can be combined.
        </LI>
        <LI>Clearance (half-life) calculator and cost-per-mg calculator.</LI>
        <LI>Guidance-only testosterone level quiz (not a diagnosis, just a signal on whether a test is worth it).</LI>
      </UL>
      <H3>Health tracking</H3>
      <UL>
        <LI>Weight, meals, and wellbeing notes in one place.</LI>
        <LI>Reminders for every application and a consistency streak.</LI>
        <LI>Progress photo comparator.</LI>
        <LI>AI assistant for general questions (doesn&apos;t replace medical advice).</LI>
      </UL>
      <H3>Family and medical report</H3>
      <UL>
        <LI>Family plan: up to 3 accounts, shared vials and routines, each with their own privacy.</LI>
        <LI>Report ready for your appointment: adherence, streak, weight trend, and side effects.</LI>
      </UL>

      <H2>What PeptiBrain is NOT</H2>
      <P>
        PeptiBrain doesn&apos;t diagnose, prescribe, or decide your dose. It&apos;s not a pharmacy or a peptide
        supplier. It never replaces a healthcare professional at any point in the process — it organizes and
        calculates what your protocol already specifies, full stop. The decision on what to use, at what dose,
        and under what supervision is always your doctor&apos;s.
      </P>

      <H2>Plans and pricing</H2>
      <P>
        You can start for free (one peptide, one active vial, streak and calendar) and upgrade to Premium when
        you need it (unlimited peptides and vials, calculators, AI assistant, full health tracking) or to
        Family if you also track someone else&apos;s protocol. Exact pricing and details for each plan are on the{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          homepage
        </Link>
        .
      </P>

      <H2>Frequently asked questions</H2>
      <H3>Is PeptiBrain free?</H3>
      <P>
        Yes, it has a real free plan (not just a trial) for one peptide and one active vial. Paid plans add
        unlimited peptides, full calculators, an AI assistant, and more.
      </P>
      <H3>Do I need a prescription or medical follow-up to use PeptiBrain?</H3>
      <P>
        PeptiBrain doesn&apos;t require or verify a prescription — it&apos;s an organization tool, not a
        dispensing one. But any peptide, GLP-1, or TRT protocol should always be carried out under medical
        supervision, with or without the app.
      </P>
      <H3>Is it only for GLP-1, or also for TRT and other peptides?</H3>
      <P>
        It works for all three: recovery and cosmetic peptides, GLP-1 (semaglutide, tirzepatide), and TRT —
        each with its own calculators and logging fields.
      </P>
      <H3>Is it available in Spanish?</H3>
      <P>
        Yes, in real Spanish (not a half-translation) and also in English, with automatic language detection
        based on your country.
      </P>
      <H3>Is my information safe?</H3>
      <P>
        Your data is tied to your account, with row-level access control (RLS) in the database — no one else
        sees your protocol unless you explicitly share access (Family plan).
      </P>

      <P>
        If you already know you need to get your protocol organized, you can{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          try PeptiBrain for free
        </Link>{" "}
        and log your first dose in under a minute.
      </P>
    </>
  );
}
