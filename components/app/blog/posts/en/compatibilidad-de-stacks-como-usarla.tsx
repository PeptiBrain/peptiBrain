import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";
import { CompatComboTable, type CompatComboRow } from "@/components/app/blog/CompatComboTable";

const ROWS: CompatComboRow[] = [
  { a: "BPC-157", b: "TB-500", status: "studied", statusLabel: "Studied", note: "The classic recovery combo — the most reported one in the whole community." },
  { a: "Ipamorelin", b: "CJC-1295", status: "studied", statusLabel: "Studied", note: "Classic GHRH + GHRP combo — the most reported one in this category." },
  { a: "Selank", b: "Semax", status: "studied", statusLabel: "Studied", note: "Classic nootropic combo: calm (Selank) + focus (Semax)." },
  { a: "Semaglutide", b: "BPC-157", status: "caution", statusLabel: "Caution", note: "Different mechanisms (metabolic vs. tissue repair) — no known conflict, but no formal study of this specific combination either." },
  { a: "Semaglutide", b: "Tirzepatide", status: "avoid", statusLabel: "Avoid", note: "Combining two GLP-1/GIP agonists at once isn't recommended." },
  { a: "Ipamorelin", b: "GHRP-2", status: "avoid", statusLabel: "Avoid", note: "Combining two GHRPs at once isn't recommended." },
];

export default function Post() {
  return (
    <>
      <P>
        &ldquo;Can I combine this with that?&rdquo; is one of the questions that comes up the most in
        any peptide community — and the one giant matrix-style tables tend to answer the worst,
        since finding your exact combination is harder than the question itself. That's why we built{" "}
        <Link href="/compatibilidad" className="font-semibold text-primary underline underline-offset-2">
          Stack Compatibility
        </Link>
        : you pick two compounds and get back a single verdict, not 500 cells.
      </P>

      <Summary label="In short:">
        The tool answers one concrete question (A + B, yes or no?) with 4 possible statuses —
        studied, caution, avoid, or no data — always pulled from what each peptide profile already
        states, never a guess. When there's no data, we say &ldquo;no data&rdquo; instead of making up
        a verdict.
      </Summary>

      <H2>How it works</H2>
      <P>
        You pick two compounds from the list and the tool instantly shows one of these four statuses.
        No verdict is invented to fill a gap — if the combination doesn't show up in any source, the
        result is honest: &ldquo;no data,&rdquo; not a fabricated green or red light.
      </P>

      <H3>Studied</H3>
      <P>
        The source itself (one or both peptide profiles) explicitly names that combination — for
        example, the &ldquo;GLOW&rdquo; recovery blend (BPC-157 + GHK-Cu + TB-500) or the classic
        GHRH + GHRP synergy.
      </P>
      <H3>Caution</H3>
      <P>
        The mechanisms don't conflict with each other, but there's no formal study of that specific
        combination either — just category-level plausibility (for example, a GLP-1 alongside a
        recovery peptide: completely different mechanisms, no known conflict, but no trial of the
        actual mix).
      </P>
      <H3>Avoid</H3>
      <P>
        There's a concrete reason not to combine them — almost always because they're two compounds
        from the same family doing the same job (two GHRPs, two GHRH analogs, two GLP-1/GIP agonists
        at once), which doesn't add effect, just redundancy.
      </P>
      <H3>No data</H3>
      <P>
        The combination doesn't show up in any source we use. That doesn't mean it's forbidden or
        that the app is broken — it literally means we couldn't find anything published about that
        specific mix. We'd rather say that than invent a verdict that looks more complete.
      </P>

      <H2>The most-checked combos</H2>
      <CompatComboTable rows={ROWS} />

      <Callout>
        These are just 6 examples to illustrate the 4 statuses — the tool covers quite a few more
        combinations across recovery/skin, GLP-1, growth peptides (GHRH/GHRP), and nootropics. Try it
        directly with your own combination in{" "}
        <Link href="/compatibilidad" className="font-semibold text-primary underline underline-offset-2">
          the tool
        </Link>
        .
      </Callout>

      <H2>How to get the most out of it</H2>
      <UL>
        <LI>
          <strong>Check every compound in your stack pairwise</strong>, not just the newest one you're
          about to add. If you're already on 3 peptides, there are 3 combinations to check, not just
          the newcomer's.
        </LI>
        <LI>
          <strong>&ldquo;No data&rdquo; isn't a green light or a red light</strong> — it's a signal
          that this specific combination has no literature behind it, and it's worth a conversation
          with your doctor before assuming it's safe by default.
        </LI>
        <LI>
          <strong>An &ldquo;avoid&rdquo; is almost always redundancy, not extreme danger</strong> — it
          usually means both compounds do the same job, so combining them doesn't multiply the
          effect, just the cost.
        </LI>
        <LI>
          <strong>Keep your full protocol in one place</strong> so you can recheck every pair when you
          add a new compound, instead of trying to remember what you were already taking.
        </LI>
      </UL>

      <P>
        If you're already running several peptides at once,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        lets you keep your whole stack logged — doses, vials, and protocol — so you can check it
        against the compatibility tool every time you add something new.
      </P>
    </>
  );
}
