import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Within the recovery and performance community, few names come up as often as BPC-157. Let&apos;s look at what
        it actually is and what the available research does — and doesn&apos;t — say.
      </P>

      <H2>What is BPC-157?</H2>
      <P>
        BPC-157 is a pentadecapeptide (a 15-amino-acid chain) derived from a protein naturally found in gastric
        juice. That&apos;s where its full name comes from, &ldquo;Body Protection Compound-157&rdquo;. It has mainly been
        researched for its possible role in tissue repair.
      </P>

      <H2>What&apos;s researched about it</H2>
      <P>The areas most mentioned in the literature and in the community are:</P>
      <UL>
        <LI><strong>Tissue repair</strong> — tendons, ligaments, and muscle.</LI>
        <LI><strong>Digestive health</strong> — consistent with its gastric origin.</LI>
        <LI><strong>Post-injury recovery</strong> — one of the reasons it became popular in sports and gym culture.</LI>
      </UL>
      <Callout>
        Most of the available evidence on BPC-157 comes from preclinical studies (animal models). That doesn&apos;t
        invalidate the scientific interest, but it does mean there isn&apos;t the same level of human clinical
        evidence as with molecules approved as medications.
      </Callout>

      <H2>How it&apos;s typically administered</H2>
      <P>
        In the community, the reference protocol usually sits around 250 mcg, once or twice a day, subcutaneous.
        A typical vial comes in 5 mg and is reconstituted with about 3 mL of bacteriostatic water — but these
        figures are just a reference for what commonly circulates, not a medical recommendation.
      </P>

      <H2>What usually confuses beginners</H2>
      <P>
        Two things cause most of the confusion: first, the unit — BPC-157 vials usually come in mcg, not mg, and
        mixing up the two multiplies the error by a thousand. Second, the frequency — being a daily dose (not
        weekly, like GLP-1s), it&apos;s easy to lose track of whether you already applied it today without a record.
      </P>
      <P>
        That&apos;s why, for a daily-use peptide like this one, it makes even more sense to keep a record of every
        application — in{" "}
        <Link href="/protocolos" className="font-semibold text-primary underline underline-offset-2">
          our reference protocols guide
        </Link>{" "}
        you can see typical values and calculate your dose in one click.
      </P>
    </>
  );
}
