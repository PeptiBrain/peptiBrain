import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        If you run more than one peptide at a time, sooner or later a notebook or phone notes app falls short.
        Here&apos;s a rundown of the most used apps today for calculating doses and tracking a peptide protocol —
        honestly, including where PeptiBrain fits and where it doesn&apos;t.
      </P>

      <H2>What a good peptide app should have</H2>
      <UL>
        <LI><strong>Reconstitution calculator</strong> — that converts mg + water + dose into syringe units.</LI>
        <LI><strong>Dose logging</strong> — an actual history, not just a one-off reminder.</LI>
        <LI><strong>Vial tracking</strong> — how much is left and when it expires.</LI>
        <LI><strong>Language support</strong> — a real, well-built interface in your language, not a half-translated one.</LI>
      </UL>

      <H2>The most used apps</H2>

      <H3>Peptide Tracker</H3>
      <P>
        One of the most established tracking apps in the space, free, available on iOS and Android. Combines a
        tracker and calculator, with solid coverage of the basic features.
      </P>

      <H3>PeptIQ</H3>
      <P>
        Goes a step beyond plain tracking: adds educational content on each peptide (mechanism, half-life,
        effects). Available on iOS, Android, and web.
      </P>

      <H3>PepCalc / PeptideCalc</H3>
      <P>
        Two apps focused specifically on the reconstitution calculator, with no signup required. A good option
        if you only need to calculate, without keeping a full protocol log.
      </P>

      <H3>Dose Track</H3>
      <P>
        Focuses on privacy (on-device calculation) and covers a wide catalog of compounds, with a more advanced
        calculation engine than the rest.
      </P>

      <H3>PeptiBrain</H3>
      <P>
        Full disclosure: we&apos;re not neutral here, so we&apos;ll say this as honestly as possible. Our main difference
        from most of this list is that we&apos;re <strong>bilingual (English and Spanish)</strong> from the ground
        up, not a half-translated add-on — and PeptiBrain adds dose logging, vial expiry tracking, a family plan
        to share tracking with others, and an AI assistant for general questions (which doesn&apos;t give medical
        advice), on top of the free reconstitution and semaglutide/tirzepatide calculators.
      </P>

      <Callout>
        None of these apps replace a healthcare professional. All of them, PeptiBrain included, are
        organization and calculation tools — not diagnostic or prescription tools.
      </Callout>

      <H2>Which one to choose?</H2>
      <P>
        If you only need to calculate a one-off reconstitution, a standalone calculator (PepCalc, PeptideCalc)
        is enough. If you run several peptides at once and want history, vial tracking, and a properly bilingual
        experience, that combination is what we aim to offer with PeptiBrain.
      </P>
      <P>
        You can try our calculators{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          free and with no signup
        </Link>{" "}
        before deciding whether to move to the full app.
      </P>
    </>
  );
}
