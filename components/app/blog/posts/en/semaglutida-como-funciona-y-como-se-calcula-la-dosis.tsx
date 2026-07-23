import { Link } from "@/i18n/navigation";
import { H2, P, UL, LI, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Semaglutide is, today, the most searched-for peptide in the weight control world — and probably the
        most misunderstood when it comes to dosing. Let&apos;s clear up both: what it does and how to calculate it
        correctly.
      </P>

      <H2>What is it and how does it work?</H2>
      <P>
        Semaglutide is a GLP-1 receptor agonist (a hormone the gut naturally produces on its own). By acting on
        that receptor, it slows gastric emptying, reduces appetite, and improves insulin sensitivity. It&apos;s the
        same mechanism shared by other well-known GLP-1s, and the reason it&apos;s so closely tied to weight control.
      </P>

      <H2>Why the dose is raised gradually (titration)</H2>
      <P>
        Almost no one starts directly at the &ldquo;final&rdquo; dose. The reference protocol increases gradually every 4
        weeks, precisely to reduce digestive side effects while the body adapts:
      </P>
      <UL>
        <LI>Weeks 1-4: 0.25 mg weekly</LI>
        <LI>Weeks 5-8: 0.5 mg weekly</LI>
        <LI>Weeks 9-12: 1 mg weekly</LI>
        <LI>Weeks 13-16: 1.7 mg weekly</LI>
        <LI>Week 17 onward: 2.4 mg maintenance</LI>
      </UL>
      <Callout>
        This schedule is the usual reference, not a prescription. The dose, the pace of increase, and whether
        it&apos;s right for you should be decided by a healthcare professional.
      </Callout>

      <H2>The real problem: converting mg to syringe units</H2>
      <P>
        This is where most people go wrong: the dose is stated in milligrams, but the syringe is loaded in{" "}
        <strong>units</strong>. To convert between the two, you need your vial&apos;s concentration (which depends on
        the vial&apos;s mg and the water you added during reconstitution), and apply that concentration to the dose
        for the week you&apos;re on.
      </P>
      <P>
        Getting it wrong in either direction has consequences: drawing too little means the dose &ldquo;does
        nothing&rdquo; (and the protocol gets abandoned thinking it doesn&apos;t work), and drawing too much breaks the
        gradual schedule that&apos;s specifically meant to minimize side effects.
      </P>

      <H2>Semaglutide vs. tirzepatide</H2>
      <P>
        Tirzepatide follows very similar logic (also titrated in phases), but it acts on two receptors instead
        of one (GIP and GLP-1), which in practice changes its dosing schedule: it starts at 2.5 mg weekly and
        rises to 15 mg maintenance — different numbers from semaglutide, so the two schedules can&apos;t be mixed.
      </P>

      <H2>How to avoid the calculation mistake</H2>
      <P>
        The simplest way to avoid getting it wrong is to stop doing the math from memory every week. Our{" "}
        <Link href="/calculadora-semaglutida" className="font-semibold text-primary underline underline-offset-2">
          semaglutide and tirzepatide calculator
        </Link>{" "}
        already has the full titration table built in: pick the phase you&apos;re on and it shows the exact units to
        draw, with the syringe drawn out.
      </P>
    </>
  );
}
