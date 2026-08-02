import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, OL, OLItem, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        If you started testosterone replacement therapy (TRT) with cypionate, enanthate, or another
        ester, your doctor probably already told you to keep a log. The problem is almost no one
        explains exactly what to write down or why it matters more than it seems in a treatment that
        runs for months or years. This is that guide.
      </P>

      <Summary label="In short:">
        TRT is evaluated through blood work and how you feel over weeks, not a single injection — so
        logging the date, dose, injection site, and symptoms lets you tell a real pattern apart from
        one bad week, and bring something concrete to your next check-up with your doctor.
      </Summary>

      <H2>Why keep a log for a treatment that lasts years?</H2>
      <P>
        Precisely because it lasts years. In a short treatment, memory is enough; in one repeated
        weekly for a long time, it's easy to lose track of when the dose was last adjusted, whether
        this month's fatigue is different from last month's, or whether that injection site has
        actually been rotating or keeps landing on the same spot without you noticing.
      </P>

      <H2>The 4 things worth logging with every injection</H2>
      <UL>
        <LI>
          <strong>Exact date and time.</strong> How consistent your interval between injections is
          (weekly, twice weekly, every other day) affects how stable your levels stay — and without an
          exact date there's no way to check whether you're actually keeping to it.
        </LI>
        <LI>
          <strong>Dose given (mg) and vial concentration.</strong> Especially if you switch supplier or
          concentration (100, 200, 250 mg/mL) — the same volume in mL can be a very different dose
          depending on the concentration.
        </LI>
        <LI>
          <strong>Injection site.</strong> Glute, thigh, or deltoid — actually rotating it (not just
          meaning to) prevents scar tissue or persistent irritation from building up in one spot.
        </LI>
        <LI>
          <strong>Symptoms between doses.</strong> Energy, mood, libido, sleep — logging how you feel
          day to day is what later lets you see whether it lines up with where you are in the cycle,
          when testosterone is higher or lower.
        </LI>
      </UL>

      <H2>How to log your first dose, step by step</H2>
      <OL>
        <OLItem n={1}>
          <strong>Write it down right away, not later.</strong> "I'll log it later" is where the data
          gets lost most of the time — memory fills the gaps with the time it "should have been," not
          the real one.
        </OLItem>
        <OLItem n={2}>
          <strong>Calculate the volume before drawing the syringe.</strong> With the dose in mg and the
          vial's concentration (mg/mL), the exact volume in mL comes from a simple division — no need
          to work it out from memory every week.
        </OLItem>
        <OLItem n={3}>
          <strong>Log the site before putting the vial away.</strong> Leave it for later and it's easy
          to forget whether it was the right or left glute this week.
        </OLItem>
        <OLItem n={4}>
          <strong>Log your symptoms even if they're subtle.</strong> A "more tired than usual" today
          against the same note from three weeks ago is exactly what helps your doctor decide whether
          the interval or dose needs adjusting.
        </OLItem>
        <OLItem n={5}>
          <strong>Review the pattern before each blood test</strong>, not every day. The daily log is
          for recording; the review is for showing up to the draw knowing what to ask.
        </OLItem>
      </OL>

      <Callout>
        A common mistake: only logging when something feels off (an energy dip, more irritability). A
        log with only the bad days isn't useful for comparison — you also need the normal days to know
        what's actually unusual.
      </Callout>

      <H2>What to look at once you have weeks of data</H2>
      <H3>How consistent the interval is, not just whether you "roughly" injected on time</H3>
      <P>
        An interval that swings a lot week to week (sometimes every 5 days, sometimes every 9) causes
        more ups and downs in your levels than a more consistent one. The log is the only honest way
        to see whether you're really as regular as you think.
      </P>
      <H3>Whether symptoms repeat at the same point in the cycle</H3>
      <P>
        With weekly injections, it's common to notice more energy in the first few days and some dip
        toward the end of the week, right before the next dose. Seeing it written down, not just felt,
        is what tells apart an expected pattern (which might suggest trying a different frequency) from
        something worth discussing directly with your doctor.
      </P>
      <H3>Whether site rotation is actually happening</H3>
      <P>
        If you've been injecting the same spot for weeks without noticing, that's the most common
        cause of persistent irritation or firmer tissue at the site — and the log is the only honest
        way to check.
      </P>

      <H2>Bringing it to your next doctor's check-up</H2>
      <P>
        A rough interval from memory doesn't help much in a 15-minute appointment, especially when
        the blood test result depends on exactly how long it's been since your last injection. What
        does help is an organized summary: date and real interval between doses, relevant symptoms,
        any change in supplier or concentration — something your doctor can look at in 30 seconds and
        understand the full pattern.
      </P>
      <P>
        That's exactly what we set out to solve with{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>
        : log every injection in seconds from your phone, calculate the exact volume with our{" "}
        <Link href="/trt-calculator" className="font-semibold text-primary underline underline-offset-2">
          TRT dose calculator
        </Link>
        , and the app builds your on-time injection streak and a report ready to show at your next
        check-up on its own — no spreadsheets or memory involved.
      </P>

      <H2>Common mistakes people make when starting out</H2>
      <UL>
        <LI>
          Not logging the vial concentration when switching suppliers, and calculating the volume as
          if it were still the same as before.
        </LI>
        <LI>
          Letting the interval between injections stretch "a couple of days" without logging it, until
          it's no longer a couple of days but a full week of accumulated drift.
        </LI>
        <LI>
          Not logging the injection site because "it's just once a week" — until the same spot starts
          feeling the effect.
        </LI>
        <LI>
          Relying on memory for the doctor's check-up instead of bringing something written, and
          showing up unable to answer "exactly how long since your last dose?" — a detail that changes
          how the blood test gets interpreted.
        </LI>
      </UL>
    </>
  );
}
