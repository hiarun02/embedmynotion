import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { LegalPage, LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "How subscription cancellation, refund requests, and billing corrections work at EmbedMyNotion.",
  alternates: { canonical: "/refund-policy" },
  openGraph: {
    title: "Refund & Cancellation Policy",
    description:
      "EmbedMyNotion subscription cancellation and refund conditions.",
    url: "/refund-policy",
    siteName: siteConfig.name,
  },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      label="Billing"
      title="Refund & Cancellation Policy"
      introduction="This policy explains how cancellations, billing corrections, and refunds will work for paid EmbedMyNotion plans."
    >
      <LegalSection title="1. Current payment availability">
        <p>
          EmbedMyNotion is currently operating without live payment processing,
          so no real subscription charge is made by the current demo. This
          policy will apply when paid checkout becomes available. The payment
          provider, final price, currency, billing interval, renewal terms, and
          taxes will be shown before a customer confirms payment.
        </p>
      </LegalSection>

      <LegalSection title="2. Digital service delivery">
        <p>
          A paid plan is a digital service. Paid features are intended to become
          available to the purchasing account promptly after successful payment
          confirmation. Delivery is complete when the account reflects the paid
          plan and its included features can be used. If activation is delayed,
          contact support and include the transaction reference—but never send a
          complete card number or password.
        </p>
      </LegalSection>

      <LegalSection title="3. Canceling a subscription">
        <p>
          You may cancel a recurring plan at any time using the billing controls
          provided with your account or by contacting support. Submit a support
          request before the next renewal date if billing controls are
          unavailable. Unless checkout states otherwise, cancellation stops the
          next renewal and takes effect at the end of the current paid period.
          You keep paid access until that date.
        </p>
        <p>
          Deleting an embed, signing out, or ceasing to use the Service does not
          by itself cancel a paid subscription.
        </p>
      </LegalSection>

      <LegalSection title="4. Refund eligibility">
        <p>
          Contact support within seven calendar days of the relevant charge. A
          refund or billing correction may be approved when:
        </p>
        <ul>
          <li>You were charged more than once for the same purchase.</li>
          <li>The amount charged differs from the amount confirmed at checkout.</li>
          <li>You were charged after a cancellation had already become effective.</li>
          <li>
            A verified technical failure on our side prevented meaningful use of
            the paid features and we could not resolve it within a reasonable time.
          </li>
          <li>Applicable law requires a refund.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Generally non-refundable situations">
        <p>
          Unless required by law, we generally do not issue refunds for a change
          of mind, an unused or partially used billing period, failure to cancel
          before renewal, incompatibility caused by a third-party website or
          service, loss of access caused by an unpublished Notion source page, or
          suspension resulting from a violation of our{" "}
          <Link href="/terms">Terms of Service</Link>.
        </p>
      </LegalSection>

      <LegalSection title="6. How to request a refund">
        <p>
          Email us from your account address when possible and include the
          transaction or invoice reference, charge date, and a short description
          of the issue. Never send a complete payment-card number, password,
          private document, or confidential Notion content.
        </p>
        <p>
          We aim to review complete requests within five business days. We may
          ask for reasonable information needed to verify the account, charge,
          and reported problem.
        </p>
      </LegalSection>

      <LegalSection title="7. Approved refunds">
        <p>
          Approved refunds are returned to the original payment method. We aim
          to instruct the payment provider within five business days after
          approval. The provider or bank may then take an additional five to ten
          business days, or longer in some regions, to display the credit. Bank,
          foreign-exchange, or intermediary fees that we did not collect may not
          be refundable.
        </p>
      </LegalSection>

      <LegalSection title="8. Chargebacks">
        <p>
          Contact support before starting a payment dispute so we can investigate
          billing errors quickly. This does not limit any right you have to
          dispute an unauthorized or incorrect charge with your payment provider.
        </p>
      </LegalSection>

      <LegalSection title="9. Policy changes and contact">
        <p>
          We may update this policy when our plans, provider, or legal obligations
          change. The policy in effect on the transaction date will normally
          govern that transaction, unless a later version gives you more
          favorable rights or applicable law requires otherwise.
        </p>
        <p>
          Cancellation and refund requests can be submitted through the{" "}
          <a href={siteConfig.supportUrl}>{siteConfig.supportEmail}</a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
