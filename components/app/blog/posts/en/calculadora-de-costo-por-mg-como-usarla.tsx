import { Link } from "@/i18n/navigation";
import { H2, H3, P, UL, LI, Callout, Summary } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Comparing peptide prices between suppliers is misleading if you only look at the vial's price —
        a pricier vial with more mg can end up cheaper per dose than a cheap one with little content in
        it. The{" "}
        <Link href="/calculadora-costo-mg" className="font-semibold text-primary underline underline-offset-2">
          Cost-per-mg Calculator
        </Link>{" "}
        does that math for you.
      </P>

      <Summary label="In short:">
        Enter the price you paid and the vial's content in mg, and the calculator tells you how much
        each mg costs you — and, if you also enter your dose, how much each dose you give actually
        costs. It doesn't convert currencies: it just divides price by content, in whatever currency you
        enter. It's a way to compare cost efficiency, not a recommendation of where to buy.
      </Summary>

      <H2>How it works</H2>
      <P>Three fields, two results:</P>
      <UL>
        <LI>
          <strong>Price paid.</strong> What the vial cost, in whatever currency you use.
        </LI>
        <LI>
          <strong>Vial content (mg).</strong> How many mg of peptide that vial contains — you can pick a
          peptide from the list to auto-fill it, or enter it manually.
        </LI>
        <LI>
          <strong>Your dose (mg), optional.</strong> If you add it, the calculator also gives you the
          cost per dose given, not just the cost per mg.
        </LI>
      </UL>
      <P>
        With price and content, the calculator divides one by the other and gives you the cost per mg.
        If you added your dose, it multiplies that cost per mg by your dose and gives you the cost per
        injection — the number that actually matters when you're comparing what your protocol costs you
        month to month.
      </P>

      <H3>Why there's no currency conversion</H3>
      <P>
        The math runs in whatever currency you enter — the calculator just divides price by vial
        content, without converting anything. If you're comparing one supplier in one currency and
        another in a different one, convert them yourself before entering the price so the comparison is
        fair.
      </P>
      <H3>Why not every peptide shows up in the selector</H3>
      <P>
        Only peptides dosed in mg are included. Ones dosed in IU (like growth hormone) don't share the
        same cost unit, so they don't apply to this particular calculator.
      </P>

      <Callout>
        A pricier vial isn't always more expensive per dose. Two vials of the same peptide with
        different content and different prices can produce a very different cost per mg — the only real
        way to compare is running this division, not looking at the sticker price.
      </Callout>

      <H2>How to get the most out of it</H2>
      <UL>
        <LI>
          <strong>Compare cost per mg across suppliers, not the vial's price.</strong> It's the only
          number that levels out vials of different sizes and actually tells you which one is more
          worthwhile.
        </LI>
        <LI>
          <strong>Add your real dose to see the cost per injection</strong>, not just per mg — that's
          the number that tells you what your whole protocol will actually cost, not just the vial on
          its own.
        </LI>
        <LI>
          <strong>Save each calculation when you switch suppliers</strong>, so you can compare the new
          supplier against the old one using the same criteria, not from memory.
        </LI>
        <LI>
          <strong>Use it as an efficiency comparison, not purchasing advice.</strong> The result tells
          you which option is cheaper per mg — deciding which supplier or product to use is still yours
          to make.
        </LI>
      </UL>

      <P>
        If you already know which peptide you're going to use and want to log your actual doses too,{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          PeptiBrain
        </Link>{" "}
        lets you calculate its exact volume and save every injection from day one.
      </P>
    </>
  );
}
