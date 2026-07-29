import { Check, X, Calculator, LayoutGrid, TrendingUp, BookOpen, Newspaper } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";
import { AppComparisonTable, type ComparisonRow } from "@/components/app/blog/AppComparisonTable";

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Automatic dose calculator", values: [true, false, false] },
  { label: "Reminder for the next application", values: [true, false, false] },
  { label: "Vial expiration tracking", values: [true, false, null] },
  { label: "Full, searchable history", values: [true, false, true] },
  { label: "Report ready for your doctor", values: [true, false, false] },
  { label: "Share with your family", values: [true, false, null] },
  { label: "Real Spanish interface", values: [true, true, true] },
  { label: "Nothing to install (works in the browser)", values: [true, true, null] },
];

function ProsConsColumn({
  title,
  items,
  positive,
}: {
  title: string;
  items: string[];
  positive: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        positive ? "border-primary/25 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            {positive ? (
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            ) : (
              <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" aria-hidden />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContentEn() {
  return (
    <>
      <H2>Why choose PeptiBrain?</H2>
      <P>
        The most honest comparison isn&apos;t against another app — it&apos;s against what you probably use
        today: scattered phone notes, or at best, a spreadsheet you put together yourself.
      </P>
      <AppComparisonTable
        columns={["PeptiBrain", "Phone notes", "Spreadsheet"]}
        rows={COMPARISON_ROWS}
        unspecifiedLabel="Depends on how you build it yourself — not included out of the box."
      />

      <H2>When does it make sense for you, and when maybe not?</H2>
      <P>Same honesty here: PeptiBrain isn&apos;t for everyone, and we&apos;d rather tell you before you sign up.</P>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ProsConsColumn
          title="It's a good fit if..."
          positive
          items={[
            "You're on a peptide, GLP-1, or TRT protocol and want to stop relying on scattered notes.",
            "You'd rather have an automatic calculator than do the math by hand every week.",
            "You need an organized report for your next doctor's appointment.",
            "You want to share tracking with a partner or family member.",
            "You're looking for an app that's actually in Spanish, not a half-translation.",
          ]}
        />
        <ProsConsColumn
          title="Maybe not for you if..."
          positive={false}
          items={[
            "You want the app to tell you what dose to take or diagnose you — it doesn't, and it shouldn't.",
            "You're not currently following any peptide, GLP-1, or TRT protocol.",
            "You're looking to buy peptides — PeptiBrain doesn't sell or distribute anything.",
          ]}
        />
      </div>

      <H2>Concrete benefits for you</H2>
      <UL>
        <LI><strong>You save time</strong> — logging a dose takes seconds, not minutes doing math.</LI>
        <LI><strong>You reduce errors</strong> — the calculator converts mg to syringe units for you, based on your real vial.</LI>
        <LI><strong>You gain consistency</strong> — the streak and reminders make it visible if you're skipping applications.</LI>
        <LI><strong>You improve the conversation with your doctor</strong> — you show up with a report, not just memory.</LI>
        <LI><strong>Your privacy is protected</strong> — row-level access control (RLS): no one sees your protocol unless you share it.</LI>
        <LI><strong>You can start without paying</strong> — the free plan is real (one peptide, one active vial), not a disguised trial.</LI>
      </UL>

      <H2>Our principles</H2>
      <P>
        Three rules we don&apos;t break: the app organizes and calculates what your protocol already specifies,
        it never decides a dose for you. The blog content never invents a fact, a citation, or a credential —
        if we can&apos;t verify it, we say so plainly. And your data is yours: no one sees it unless you
        explicitly share access.
      </P>

      <H2>How we write the blog content</H2>
      <P>
        Articles are based on already-established public information (known mechanisms, reference titration
        schedules, standard pharmacology rules) and the same reference data used by the app&apos;s own tools.
        When we cite a study, we link directly to the source (PubMed/DOI) — if we can&apos;t find a verifiable
        source, we say so explicitly instead of inventing a fact or citation.
      </P>

      <Callout>
        No article, calculator, or AI assistant response constitutes medical advice, diagnosis, or
        prescription. The content is educational — the decision on what to use, at what dose, and under what
        supervision is always your doctor&apos;s.
      </Callout>

      <H2>Security and privacy of your data</H2>
      <P>
        Every account has row-level access control (RLS) in the database: only you see your protocol, doses,
        and history, unless you explicitly share access with the Family plan. We don&apos;t sell your data to
        third parties or use it to train models without your consent.
      </P>

      <H2>Who&apos;s behind it</H2>
      <P>
        PeptiBrain is a product of Digital Dreams World LLC (2105 Vista Oeste NW Suite E 3564, Albuquerque, NM
        87120, United States). We don&apos;t currently have our own medical advisory board — if we do in the
        future, we&apos;ll announce it here with a real name, not before.
      </P>

      <H2>Explore PeptiBrain</H2>
      <P>If you&apos;re still looking around before deciding, here&apos;s what&apos;s most useful next:</P>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link
          href="/herramientas"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Calculator className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Try the free calculators, no signup</span>
        </Link>
        <Link
          href="/protocolos"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <LayoutGrid className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Browse the peptide library and protocols</span>
        </Link>
        <Link
          href="/blog/peptidos-populares"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <TrendingUp className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">The most-searched peptides right now</span>
        </Link>
        <Link
          href="/blog/que-es-peptibrain"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">Read the full guide: What is PeptiBrain?</span>
        </Link>
        <Link
          href="/blog"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40 sm:col-span-2"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Newspaper className="size-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">See the full blog</span>
        </Link>
      </div>

      <H2>Contact</H2>
      <P>Questions, corrections, or something you think we should review? Write to us at hello@peptibrain.com.</P>
    </>
  );
}
