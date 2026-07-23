import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Instead of going peptide by peptide, it&apos;s often more useful to start from the other end: what&apos;s your
        goal? Here we organize them by what people search for most often.
      </P>

      <H2>I want to lose weight</H2>
      <P>By far the category with the most demand. The most mentioned:</P>
      <UL>
        <LI><strong>Semaglutide</strong> — GLP-1 agonist, reduces appetite and slows gastric emptying.</LI>
        <LI><strong>Tirzepatide</strong> — dual GIP/GLP-1 agonist, same goal with a somewhat different mechanism.</LI>
        <LI><strong>Retatrutide</strong> — triple agonist, under research for weight control.</LI>
      </UL>
      <P>
        If you&apos;re going down this path, read our guide on{" "}
        <Link href="/blog/semaglutida-como-funciona-y-como-se-calcula-la-dosis" className="font-semibold text-primary underline underline-offset-2">
          semaglutide and how the dose is calculated
        </Link>
        .
      </P>

      <H2>I&apos;m recovering from an injury</H2>
      <UL>
        <LI><strong>BPC-157</strong> — the most mentioned for tissue repair and digestive health.</LI>
        <LI><strong>TB-500</strong> — associated with healing, cell regeneration, and mobility.</LI>
      </UL>
      <P>
        We go deeper into the first one in{" "}
        <Link href="/blog/bpc-157-que-es-y-para-que-se-usa" className="font-semibold text-primary underline underline-offset-2">
          this article on BPC-157
        </Link>
        .
      </P>

      <H2>I want to gain muscle</H2>
      <UL>
        <LI><strong>Ipamorelin</strong> — GH secretagogue with a milder side-effect profile.</LI>
        <LI><strong>CJC-1295</strong> — long-acting, often combined with the previous one.</LI>
        <LI><strong>MK-677</strong> — the only option on this list active orally.</LI>
      </UL>

      <H2>I&apos;m interested in longevity / anti-aging</H2>
      <UL>
        <LI><strong>Epitalon</strong> — derived from the pineal gland, studied in the context of cellular aging.</LI>
        <LI><strong>MOTS-c</strong> — of mitochondrial origin, trending for its metabolic role.</LI>
        <LI><strong>GHK-Cu</strong> — also shows up here for its role in cell regeneration.</LI>
      </UL>

      <H2>Hair and skin</H2>
      <UL>
        <LI><strong>GHK-Cu</strong> — the best known, associated with collagen production.</LI>
      </UL>
      <P>
        We dedicate a full article to it:{" "}
        <Link href="/blog/ghk-cu-el-peptido-de-la-piel" className="font-semibold text-primary underline underline-offset-2">
          GHK-Cu and the skin
        </Link>
        .
      </P>

      <Callout>
        This guide organizes information by goal for educational purposes. It doesn&apos;t imply that any specific
        peptide is safe or right for you — that&apos;s for a healthcare professional to determine.
      </Callout>

      <H2>Once you&apos;ve chosen, the practical part comes next</H2>
      <P>
        Whatever your goal, the next step is the same: calculate the dose correctly and keep a record. Our{" "}
        <Link href="/protocolos" className="font-semibold text-primary underline underline-offset-2">
          reference protocols
        </Link>{" "}
        page has typical dose and frequency for each peptide, with direct access to the calculator.
      </P>
    </>
  );
}
