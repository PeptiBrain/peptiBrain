import { Link } from "@/i18n/navigation";
import { H2, H3, P, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        If you start researching peptides, the same names quickly come up again and again. Here&apos;s a quick
        rundown of the most mentioned ones, organized by what&apos;s most researched about each.
      </P>

      <H2>Weight loss</H2>
      <H3>Semaglutide</H3>
      <P>
        GLP-1 receptor agonist. Reduces appetite, slows gastric emptying, and improves insulin sensitivity. By
        far the most searched-for on this entire list.
      </P>
      <H3>Tirzepatide</H3>
      <P>Dual GIP/GLP-1 agonist. Supports weight control and improves insulin sensitivity.</P>
      <H3>Retatrutide</H3>
      <P>Triple GIP/GLP-1/glucagon agonist, under research for weight control.</P>

      <H2>Recovery and tissue repair</H2>
      <H3>BPC-157</H3>
      <P>
        Pentadecapeptide derived from a gastric protein. Known for its tissue repair and digestive health
        properties.
      </P>
      <H3>TB-500</H3>
      <P>Synthetic fragment of thymosin beta-4. Promotes healing, cell regeneration, and mobility.</P>

      <H2>Muscle and growth hormone</H2>
      <H3>Ipamorelin</H3>
      <P>Selective growth hormone secretagogue, with a milder side-effect profile than others.</P>
      <H3>CJC-1295</H3>
      <P>Long-acting GH-releasing hormone analog. Often combined with ipamorelin.</P>
      <H3>MK-677 (Ibutamoren)</H3>
      <P>Non-peptide GH secretagogue active orally. Mimics ghrelin&apos;s action.</P>

      <H2>Longevity and anti-aging</H2>
      <H3>Epitalon</H3>
      <P>Synthetic peptide derived from the pineal gland. Studied for its possible relationship with cellular aging.</P>
      <H3>MOTS-c</H3>
      <P>Mitochondria-derived peptide. Trending for its possible role in metabolism.</P>

      <H2>Skin and beauty</H2>
      <H3>GHK-Cu</H3>
      <P>
        Copper-peptide complex naturally present in the body. Widely used in cosmetics for its association with
        collagen production.
      </P>

      <Callout>
        This is an informational list of the most mentioned peptides, not a recommendation for use. Many are
        still under research and their use should happen under a healthcare professional&apos;s supervision.
      </Callout>

      <H2>Now organized by what you&apos;re after</H2>
      <P>
        If you&apos;d rather see them organized by your specific goal (weight loss, recovery, muscle, anti-aging, or
        skin), we have a{" "}
        <Link href="/blog/peptidos-segun-tu-objetivo" className="font-semibold text-primary underline underline-offset-2">
          goal-based guide
        </Link>
        . And if you already know which one you want to use, our{" "}
        <Link href="/protocolos" className="font-semibold text-primary underline underline-offset-2">
          protocols guide
        </Link>{" "}
        has reference doses and frequency for each one.
      </P>
    </>
  );
}
