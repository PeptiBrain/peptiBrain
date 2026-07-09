import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Hero } from "@/components/app/landing/Hero";
import { Benefits } from "@/components/app/landing/Benefits";
import { HowItWorks } from "@/components/app/landing/HowItWorks";
import { Pricing } from "@/components/app/landing/Pricing";
import { Testimonials } from "@/components/app/landing/Testimonials";
import { Faq } from "@/components/app/landing/Faq";
import { FinalCta } from "@/components/app/landing/FinalCta";
import { UtmCapture } from "@/components/app/UtmCapture";

export default function Home() {
  return (
    <>
      <UtmCapture />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
