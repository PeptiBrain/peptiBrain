import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, OL, OLItem, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        If you just started semaglutide, tirzepatide, or another GLP-1, you've probably already heard
        the advice: &ldquo;keep a log.&rdquo; But nobody really explains what to write down, when to do it, or
        why it matters. This is the step-by-step guide we wish we'd had on day one.
      </P>

      <H2>Why track it, if it's just one weekly shot anyway?</H2>
      <P>
        Because GLP-1 isn't judged by one week in isolation — it's judged by the pattern across
        several weeks. Without a log, it's easy to forget when you titrated up, to mix up whether
        this week's nausea is normal or different from last time, or to show up at your appointment
        with nothing concrete beyond &ldquo;I think it's going well.&rdquo;
      </P>

      <H2>The 5 things worth logging with every dose</H2>
      <UL>
        <LI>
          <strong>Exact date and time.</strong> Not &ldquo;Monday&rdquo; — the actual time, since that's what
          lets you see if you're drifting off schedule week to week.
        </LI>
        <LI>
          <strong>Dose taken (mg or mcg).</strong> Especially during titration, when the number
          changes every few weeks.
        </LI>
        <LI>
          <strong>Injection site.</strong> Abdomen, thigh, or arm — rotating it keeps the skin from
          getting irritated in the same spot every time.
        </LI>
        <LI>
          <strong>Weight.</strong> You don't need to weigh in daily; once a week, under similar
          conditions, is plenty to see the real trend.
        </LI>
        <LI>
          <strong>Side effects, if any.</strong> Nausea, constipation, reflux — logging when they show
          up relative to the dose is what later lets you see whether they're actually easing over
          time.
        </LI>
      </UL>

      <H2>How to log your first dose, step by step</H2>
      <OL>
        <OLItem n={1}>
          <strong>Log it in the moment, not later.</strong> "I'll write it down later" is where the
          data gets lost most of the time — memory fills the gap with the time it "should have been,"
          not the real one.
        </OLItem>
        <OLItem n={2}>
          <strong>Stick to one unit system.</strong> If your vial is in mg but you think in syringe
          units, pick one system and don't switch mid-protocol.
        </OLItem>
        <OLItem n={3}>
          <strong>Weigh in on the same day of the week.</strong> Weight swings with hydration, food,
          and time of day — comparing Monday to Monday is what actually reflects the trend, not
          comparing any random day to any other.
        </OLItem>
        <OLItem n={4}>
          <strong>Log side effects even when mild.</strong> "Mild nausea" today versus "strong nausea"
          three weeks ago is exactly the data point your doctor needs to decide whether to slow down
          titration.
        </OLItem>
        <OLItem n={5}>
          <strong>Review the pattern every 2-4 weeks</strong>, not daily. Daily logging is for
          capturing; the review is for understanding what's happening as a whole.
        </OLItem>
      </OL>

      <Callout>
        A common mistake: only logging when something goes wrong (a bad nausea day, a missed dose). A
        log with only the bad days isn't useful for comparison — you also need the normal days to
        know what's actually unusual.
      </Callout>

      <H2>What to look at once you have a few weeks of data</H2>
      <H3>The weight trend, not a single day's number</H3>
      <P>
        Any given day can swing from water retention, salty food, or your hormonal cycle. What
        matters is the overall 3-4 week line — if it's trending down, you're on track, even if one
        stray day doesn't look like it.
      </P>
      <H3>Whether side effects repeat at the same point in the cycle</H3>
      <P>
        Many people notice more nausea in the first 2-3 days after each dose, easing by the end of
        the week. Seeing it written down, not just felt, is what tells apart an expected pattern from
        something worth flagging to your doctor.
      </P>
      <H3>Injection site rotation</H3>
      <P>
        If you've been injecting the same spot for weeks without noticing, that's the most common
        cause of persistent irritation — and a log is the only honest way to check.
      </P>

      <H2>Bringing it to your doctor's appointment</H2>
      <P>
        A scrap of paper with scattered dates doesn't help much in a 15-minute visit. What does help
        is an organized summary: dose per week, weight, side effects — something your doctor can
        scan in 30 seconds and understand the full pattern, instead of reconstructing it question by
        question.
      </P>
      <P>
        That's exactly what we built{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        to solve: log every dose in seconds from your phone, and the app builds the weight trend,
        your on-time streak, and a print-ready report on its own — no spreadsheets, no relying on
        memory.
      </P>

      <H2>Common mistakes when getting started</H2>
      <UL>
        <LI>
          Switching apps or notebooks partway through and losing the history of the first few weeks —
          exactly the ones that show how it all started.
        </LI>
        <LI>
          Weighing in at different times of day, which makes the trend look noisier than it really
          is.
        </LI>
        <LI>
          Not logging the injection site because "it's just once a week anyway" — until the skin
          starts to show it.
        </LI>
        <LI>
          Relying on memory for the doctor's visit instead of bringing something written down, and
          not being able to answer "when exactly did the nausea start?"
        </LI>
      </UL>
    </>
  );
}
