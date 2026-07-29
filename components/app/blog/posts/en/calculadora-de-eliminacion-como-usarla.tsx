import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        &ldquo;How long does this take to leave my body?&rdquo; is a question that comes down to each
        compound's half-life — a pharmacology fact, not an opinion. The{" "}
        <Link href="/calculadora-eliminacion" className="font-semibold text-primary underline underline-offset-2">
          Clearance Calculator
        </Link>{" "}
        takes that figure and turns it into an estimated time, without guessing anything we can't back
        up.
      </P>

      <Summary label="In short:">
        Pick a peptide from the list and the tool shows its known half-life and the estimated clearance
        time, calculated as 5 half-lives (~97% eliminated) — the standard pharmacology rule, the same
        one clinical calculators use. Only peptides with a reliable half-life figure are listed; the
        rest are deliberately left out.
      </Summary>

      <H2>How it works</H2>
      <P>
        You pick a peptide from the selector, and the calculator shows its half-life (the time it takes
        for the amount of the compound in your body to drop by half) and, from there, the estimated time
        for full clearance.
      </P>

      <H3>Why 5 half-lives</H3>
      <P>
        It's the standard pharmacology rule: after 5 half-lives, a compound is considered practically
        eliminated from the body (~97%). It's not a number we made up for this calculator — it's the
        same reference clinical calculators generally use. That's why the result you see is always 5
        times that specific peptide's half-life.
      </P>
      <H3>Why not every peptide shows up</H3>
      <P>
        The calculator only includes peptides with a reliable half-life figure. When that data doesn't
        exist, or is too scattered across sources, we'd rather leave the peptide out than give you a
        made-up estimate that looks more solid than it actually is.
      </P>

      <Callout>
        The result itself carries the caveat: it varies by metabolism, accumulated dose, and other
        individual factors — it's not an exact figure for you specifically, it's an estimate based on
        the compound's known half-life.
      </Callout>

      <H2>How to get the most out of it</H2>
      <UL>
        <LI>
          <strong>Use it to understand the order of magnitude, not the exact day.</strong> Knowing
          whether a compound takes hours, days, or weeks to clear is the useful part — the precise
          number always depends on individual factors the calculator can't know.
        </LI>
        <LI>
          <strong>Compare it against your dosing frequency, don't look at it in isolation.</strong> If
          your interval between doses is shorter than the compound's half-life, some accumulation in your
          system is expected — that's useful context for understanding why your protocol is designed the
          way it is.
        </LI>
        <LI>
          <strong>If your peptide isn't in the selector</strong>, don't assume a clearance time based on
          a similar compound — its absence means there's no reliable data, not that it's instant or
          indefinite.
        </LI>
        <LI>
          <strong>Bring it as a question to your doctor</strong>, especially before a blood test or if
          you're combining it with another treatment — the calculator gives you the starting point of
          that conversation, not the final answer.
        </LI>
      </UL>

      <P>
        If you want to cross-reference this with your own dosing history — when you started, when you
        paused, how often you injected —{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        keeps that log for you, ready to check alongside this calculator.
      </P>
    </>
  );
}
