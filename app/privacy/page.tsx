import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-base">
      <Navbar />
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl text-text-primary mb-6">
            Privacy Policy
          </h1>
          <div className="w-16 h-0.5 bg-accent-gold/60 mb-8" />
          <p className="text-lg text-text-secondary leading-relaxed">
            This page is coming soon.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
