import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        A perfectly calculated peptide loses effectiveness all the same if it&apos;s stored badly — and it sometimes
        goes unnoticed because it doesn&apos;t smell or visibly change. Here are the basic storage rules, before and
        after reconstitution.
      </P>

      <H2>Before reconstitution (lyophilized powder)</H2>
      <P>As a powder, unreconstituted, most peptides are fairly stable if stored properly:</P>
      <UL>
        <LI><strong>Fridge or freezer</strong>, per the supplier&apos;s instructions — many last months or even years unopened, refrigerated.</LI>
        <LI><strong>Protected from light</strong> — direct light degrades the peptide&apos;s structure over time; the original vial usually already comes in dark glass for this reason.</LI>
        <LI><strong>Sealed</strong> — don&apos;t open it until you&apos;re going to reconstitute it.</LI>
      </UL>

      <H2>After reconstitution</H2>
      <P>
        The rules change here: once the peptide is mixed with bacteriostatic water, it becomes much more
        sensitive.
      </P>
      <UL>
        <LI><strong>Always in the fridge</strong> (not the freezer — freezing an already reconstituted vial can damage the peptide&apos;s structure).</LI>
        <LI><strong>Limited shelf life</strong> — the usual reference in the community is about 30 days refrigerated, though it varies by specific peptide.</LI>
        <LI><strong>Away from direct light</strong> — keep it in its box or wrapped, not on the fridge door where it gets light every time it opens.</LI>
      </UL>

      <Callout>
        If the liquid looks cloudy, changes color, or particles appear, discard the vial even if the reference
        time hasn&apos;t passed — it&apos;s a sign something went wrong.
      </Callout>

      <H2>Enemy number one: heat</H2>
      <P>
        Leaving a vial in a car in the sun, near a window, or in an unrefrigerated travel bag for hours can
        degrade it much faster than any other factor. If you travel, use a thermal bag with an ice pack — it&apos;s
        the simplest way to keep the cold chain going outside the house.
      </P>

      <H2>How to not lose track</H2>
      <P>
        The most common problem isn&apos;t not knowing the rule, it&apos;s forgetting when you opened each vial. Writing
        down each one&apos;s reconstitution date (by hand or in an app) is the only way to know, at a glance, which
        ones are still good and which ones you should discard.
      </P>
      <P>
        Our app automatically warns you when a vial is about to expire — you can see how it works on the{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain homepage
        </Link>
        .
      </P>
    </>
  );
}
