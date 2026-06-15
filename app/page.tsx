import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { MarqueeBar } from "@/components/landing/marquee-bar";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CardShowcase } from "@/components/landing/card-showcase";
import { SecuritySection } from "@/components/landing/security";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export const revalidate = 3600;

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg-base overflow-x-hidden w-full">
      <Navbar />
      <div className="pt-16">
        <Hero />
      </div>
      <MarqueeBar />
      <Features />
      <Stats />
      <HowItWorks />
      <CardShowcase />
      <SecuritySection />
      <Pricing />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
