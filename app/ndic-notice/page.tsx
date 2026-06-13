import { LegalLayout } from "@/components/LegalLayout";

export default function NDICNoticePage() {
  return (
    <LegalLayout title="NDIC Notice" lastUpdated="June 2025">
      <section>
        <h2 className="text-white text-base font-semibold mb-2">Nigeria Deposit Insurance Corporation (NDIC)</h2>
        <p>Vaulté Financial Services Ltd operates in partnership with licensed deposit-taking institutions regulated by the Central Bank of Nigeria (CBN). Customer deposits held through the Vaulté platform are eligible for protection under the Nigeria Deposit Insurance Corporation (NDIC) scheme.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">Deposit Protection Limit</h2>
        <p>The NDIC insures eligible deposits up to a maximum of <strong className="text-white">₦5,000,000 (Five Million Naira)</strong> per depositor, per insured institution, in the event of bank failure. This coverage applies to savings and current account balances held with our partner institution.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">What Is Covered</h2>
        <p>NDIC coverage applies to: savings account balances; current account balances; and fixed deposit balances. Coverage is per depositor across all accounts held at the same institution, not per account.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">What Is Not Covered</h2>
        <p>The following are generally not covered by NDIC insurance: investment products; foreign currency deposits; funds held in transit; and amounts exceeding the ₦5,000,000 per-depositor limit.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">More Information</h2>
        <p>For full details on NDIC deposit insurance coverage, visit the official NDIC website at <strong className="text-white">ndic.org.ng</strong> or contact the NDIC directly at their head office: Plot 447/448, Constitution Avenue, Central Business District, Abuja, FCT.</p>
      </section>

      <section>
        <h2 className="text-white text-base font-semibold mb-2">Contact Vaulté</h2>
        <p>For questions about how your deposits are protected, contact us at: support@vaulte.app</p>
      </section>
    </LegalLayout>
  );
}
