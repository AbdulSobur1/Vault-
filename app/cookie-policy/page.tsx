import { LegalLayout } from "@/components/LegalLayout";

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="June 2025">
      <section>
        <h2 className="text-white text-base font-semibold mb-2">1. What Are Cookies</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, maintain sessions, and improve functionality. Vaulté uses cookies strictly for operational purposes.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">2. Cookies We Use</h2>
        <p><strong className="text-white">Session cookies:</strong> Used to keep you logged in during your visit. These are deleted when you close your browser.</p>
        <p className="mt-2"><strong className="text-white">Security cookies:</strong> Used to detect and prevent fraudulent activity and protect your account.</p>
        <p className="mt-2"><strong className="text-white">Preference cookies:</strong> Used to remember your in-app settings such as your selected account view.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">3. Cookies We Do NOT Use</h2>
        <p>Vaulté does not use advertising cookies, third-party tracking cookies, analytics cookies that share data with external parties, or any cookie that profiles your browsing behaviour outside of our Platform.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">4. Managing Cookies</h2>
        <p>You can control or delete cookies through your browser settings. Please note that disabling essential session cookies will prevent you from logging into Vaulté. Instructions for managing cookies are available on your browser&apos;s support page.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">5. Contact</h2>
        <p>For questions about our use of cookies, contact us at: privacy@vaulte.app</p>
      </section>
    </LegalLayout>
  );
}
