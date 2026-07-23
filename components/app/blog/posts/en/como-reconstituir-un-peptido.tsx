import { Link } from "@/i18n/navigation";
import { H2, P, OL, OLItem, Callout } from "@/components/app/blog/ArticleBlocks";

export default function Post() {
  return (
    <>
      <P>
        Reconstitution is the step that raises the most questions when starting out: the peptide comes as a
        powder inside a vial, and you need to &ldquo;activate&rdquo; it with water before you can use it. It sounds more
        complicated than it is — let&apos;s go step by step.
      </P>

      <H2>What is bacteriostatic water?</H2>
      <P>
        It&apos;s sterile water with a preservative (benzyl alcohol) that prevents bacterial growth during the days
        the reconstituted vial is in use. It&apos;s not regular or distilled water — it&apos;s used specifically for this
        because it allows multiple uses of the same vial without it becoming contaminated.
      </P>

      <H2>The 4 steps</H2>
      <OL>
        <OLItem n={1}>
          <strong>Check the vial&apos;s mg.</strong> Every vial states how much powdered peptide it contains (e.g.,
          5 mg). That figure never changes — it&apos;s set by the manufacturer.
        </OLItem>
        <OLItem n={2}>
          <strong>Decide how much water to add.</strong> There&apos;s no single &ldquo;correct&rdquo; amount — the more water,
          the more diluted it is, and the more units you&apos;ll need to draw for the same dose. What matters is
          consistency: always use the same amount for that specific vial.
        </OLItem>
        <OLItem n={3}>
          <strong>Calculate the concentration.</strong> It&apos;s simply mg ÷ mL of water. A 5 mg vial with 2 mL of
          water comes out to 2.5 mg/mL. That figure is what you need to know how much to draw later.
        </OLItem>
        <OLItem n={4}>
          <strong>Store the vial cold</strong> and write down the date you reconstituted it — that&apos;s when its
          shelf life starts counting.
        </OLItem>
      </OL>

      <Callout>
        A reconstituted vial doesn&apos;t last forever. The usual reference in the community is about 30 days
        refrigerated, though it varies by peptide — past that point, it&apos;s typically discarded even if product
        remains.
      </Callout>

      <H2>From concentration to syringe: units, not milligrams</H2>
      <P>
        This is where most people get confused: on an insulin syringe you don&apos;t draw milligrams, you draw{" "}
        <strong>units</strong> (on a U-100 syringe, 100 units equal 1 mL). To know how many units correspond to
        your dose, you need to combine three figures: your vial&apos;s concentration, the dose you want to apply, and
        the syringe type.
      </P>
      <P>
        Doing that math in your head every time is where most mistakes slip in. Our{" "}
        <Link href="/calculadora" className="font-semibold text-primary underline underline-offset-2">
          free reconstitution calculator
        </Link>{" "}
        does exactly that conversion instantly, with a syringe drawing so you don&apos;t get it wrong.
      </P>

      <H2>Mistakes that keep repeating</H2>
      <P>
        Eyeballing a different water amount from one vial to another of the same peptide, not writing down when
        each vial was reconstituted, and relying on memory for the dose instead of keeping a written record. All
        three are fixed by the same habit: write everything down from day one.
      </P>
    </>
  );
}
