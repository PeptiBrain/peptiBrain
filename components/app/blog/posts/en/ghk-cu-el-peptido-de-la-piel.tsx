import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        If you&apos;re into skincare beyond the usual creams, you&apos;ve probably come across GHK-Cu. It&apos;s one of the
        few peptides that also has a real presence in commercial cosmetics, not just biohacking forums.
      </P>

      <H2>What is GHK-Cu?</H2>
      <P>
        GHK-Cu is a tripeptide (three amino acids) bound to a copper ion — hence the &ldquo;Cu&rdquo; in its name (copper&apos;s
        chemical symbol). It&apos;s naturally found in human plasma, saliva, and urine, and its concentration
        decreases with age, which has fueled interest in its role in skin aging.
      </P>

      <H2>What&apos;s researched about it</H2>
      <UL>
        <LI><strong>Collagen production</strong> — its best-known association.</LI>
        <LI><strong>Skin regeneration</strong> — studied in the context of wound healing.</LI>
        <LI><strong>Antioxidant activity</strong> — the copper-peptide complex has activity related to oxidative stress.</LI>
        <LI><strong>Hair health</strong> — a more recent area of interest, still with less backing than skin.</LI>
      </UL>
      <Callout>
        Unlike other peptides on this list, GHK-Cu has a longer track record in topical applications (creams,
        serums) besides the injectable route, which explains its presence in cosmetics.
      </Callout>

      <H2>Topical vs. injectable</H2>
      <P>
        It&apos;s important to distinguish between the two forms it appears in: in cosmetics, it usually comes
        formulated into serums or creams for direct application on the skin. In the use that circulates in
        biohacking communities, on the other hand, it&apos;s handled as a vial to reconstitute and inject, just like
        other peptides on this blog — and that&apos;s the use to which the same reconstitution and dosing care
        applies.
      </P>

      <H2>If you&apos;re going to reconstitute it</H2>
      <P>
        The same rules as always apply: calculate the concentration correctly based on the vial&apos;s mg and the
        water added, keep it refrigerated once reconstituted, and don&apos;t lose track of how long the vial has been
        open. Our{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          reconstitution calculator
        </Link>{" "}
        works exactly the same for GHK-Cu as for any other peptide vial.
      </P>
    </>
  );
}
