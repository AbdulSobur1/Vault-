import { LegalLayout } from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="June 2025">
      <section>
        <h2 className="text-white text-base font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>By registering for and using Vaulté (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Vaulté Financial Services Ltd, a company registered in Nigeria. If you do not agree to these terms, please do not use the Platform.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">2. Eligibility</h2>
        <p>You must be at least 18 years of age and a resident of the Federal Republic of Nigeria to open a Vaulté account. By creating an account, you confirm that the information you provide is accurate and complete. Vaulté reserves the right to suspend or terminate accounts found to contain false information.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">3. Account Responsibilities</h2>
        <p>You are responsible for maintaining the confidentiality of your login credentials. You agree not to share your password or allow any third party to access your account. You must notify Vaulté immediately at support@vaulte.app if you suspect any unauthorised access to your account.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">4. Prohibited Activities</h2>
        <p>You agree not to use Vaulté for any unlawful purpose, including but not limited to money laundering, financing of terrorism, fraud, or any activity that violates applicable Nigerian law, including the Money Laundering (Prohibition) Act and regulations issued by the Central Bank of Nigeria (CBN).</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">5. Transaction Limits</h2>
        <p>Vaulté may impose daily, weekly, or monthly transaction limits on your account in compliance with CBN regulations and our internal risk policies. These limits may be adjusted without prior notice. You will be notified of applicable limits within your account dashboard.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">6. Fees and Charges</h2>
        <p>Vaulté offers both free and premium account tiers. Applicable fees are displayed on our Pricing page and within your account dashboard before any transaction is processed. We reserve the right to update our fee structure with 30 days&apos; notice to existing users.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">7. Termination</h2>
        <p>Vaulté reserves the right to suspend or permanently close your account at any time if you breach these terms, engage in suspicious activity, or as required by applicable law or regulatory directive. You may also close your account at any time by contacting us at support@vaulte.app.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">8. Limitation of Liability</h2>
        <p>To the maximum extent permitted by Nigerian law, Vaulté shall not be liable for any indirect, incidental, or consequential loss arising from your use of the Platform, including loss of funds due to unauthorised access resulting from your failure to safeguard your credentials.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">9. Governing Law</h2>
        <p>These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">10. Contact</h2>
        <p>For questions about these Terms, contact us at: legal@vaulte.app or write to Vaulté Financial Services Ltd, Victoria Island, Lagos, Nigeria.</p>
      </section>
    </LegalLayout>
  );
}
