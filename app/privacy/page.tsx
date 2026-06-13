import { LegalLayout } from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="June 2025">
      <section>
        <h2 className="text-white text-base font-semibold mb-2">1. Introduction</h2>
        <p>Vaulté Financial Services Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect information you provide when using the Vaulté platform, in accordance with the Nigeria Data Protection Regulation (NDPR) 2019.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">2. Data We Collect</h2>
        <p>We collect the following categories of personal data: identity data (full name, date of birth, gender, NIN/BVN), contact data (email address, phone number, residential address), financial data (account balances, transaction history), technical data (IP address, browser type, device identifiers), and usage data (pages visited, actions taken within the Platform).</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">3. How We Use Your Data</h2>
        <p>We use your data to: create and manage your Vaulté account; process transactions; comply with CBN KYC (Know Your Customer) requirements; detect and prevent fraud; send account notifications and service updates; and improve the Platform. We do not sell your personal data to third parties.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">4. Data Storage &amp; Security</h2>
        <p>Your data is stored on secure, encrypted servers. We use industry-standard encryption (TLS 1.3) for data in transit and AES-256 for data at rest. Access to personal data is restricted to authorised personnel only. Passwords are hashed using bcrypt and are never stored in plain text.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">5. Data Retention</h2>
        <p>We retain your personal data for as long as your account is active and for a minimum of 5 years after account closure, as required by Nigerian financial regulations. Transaction records are retained for 7 years in compliance with CBN directives.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">6. Your Rights</h2>
        <p>Under the NDPR, you have the right to: access your personal data; request corrections to inaccurate data; request deletion of your data (subject to regulatory retention requirements); withdraw consent where processing is based on consent; and lodge a complaint with the National Information Technology Development Agency (NITDA).</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">7. Cookies</h2>
        <p>We use essential cookies to maintain your session and platform security. We do not use advertising or tracking cookies. See our Cookie Policy for full details.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">8. Contact</h2>
        <p>For privacy-related enquiries or to exercise your rights, contact our Data Protection Officer at: privacy@vaulte.app</p>
      </section>
    </LegalLayout>
  );
}
