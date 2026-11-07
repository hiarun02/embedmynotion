import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { LegalPage, LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules and conditions that apply when using EmbedMyNotion.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service",
    description: "The terms that govern use of EmbedMyNotion.",
    url: "/terms",
    siteName: siteConfig.name,
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      label="Legal"
      title="Terms of Service"
      introduction="These Terms describe your rights and responsibilities when creating, managing, or viewing embeds through EmbedMyNotion."
    >
      <LegalSection title="1. Agreement to these Terms">
        <p>
          By accessing or using the EmbedMyNotion website, dashboard, APIs, or
          published embed service (together, the &quot;Service&quot;), you agree
          to these Terms of Service. If you use the Service for an organization,
          you confirm that you are authorized to accept these Terms for that
          organization. If you do not agree, do not use the Service.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility and accounts">
        <p>
          You must have legal capacity to enter into this agreement. If you have
          not reached the age of majority where you live, a parent or guardian
          must authorize your use. You are responsible for your account, for the
          activity performed through it, and for keeping access to your Google
          account secure. Notify support promptly if you believe your account has
          been used without permission.
        </p>
      </LegalSection>

      <LegalSection title="3. The Service">
        <p>
          EmbedMyNotion converts a published Notion page into a configurable web
          embed. Features may include responsive presentation, appearance and
          layout controls, password protection, approved-email access, and
          generated iframe code. The source Notion page must remain publicly
          available to Notion and EmbedMyNotion for the embed to load.
        </p>
        <p>
          We may add, change, limit, or discontinue features. We will try to
          provide reasonable notice when a material change negatively affects a
          paid plan, unless an urgent security, legal, or technical issue makes
          advance notice impractical.
        </p>
      </LegalSection>

      <LegalSection title="4. Your content and permissions">
        <p>
          You retain your rights in the URLs, settings, custom CSS, and content
          you make available through the Service. You grant us a limited,
          non-exclusive permission to retrieve, process, cache, adapt, and
          display that material only as needed to operate, secure, and improve
          the Service.
        </p>
        <p>
          You confirm that you own the content or have permission to publish and
          embed it. You are responsible for reviewing a Notion page before
          publishing it, including personal information, contributor details,
          files, and linked pages that may become public. Password and
          approved-email controls on an EmbedMyNotion URL do not make the
          original Notion source page private.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p>You may not use the Service to:</p>
        <ul>
          <li>Break the law or violate another person&apos;s rights.</li>
          <li>Publish content you are not authorized to use or distribute.</li>
          <li>Distribute malware, phishing material, scams, or harmful code.</li>
          <li>Harass, threaten, exploit, or unlawfully discriminate against others.</li>
          <li>Probe, bypass, or interfere with security or access controls.</li>
          <li>Overload, scrape, reverse engineer, or disrupt the Service except where law permits.</li>
          <li>Misrepresent an affiliation with EmbedMyNotion or Notion.</li>
          <li>Resell the Service or provide account access to others without our written permission.</li>
        </ul>
        <p>
          We may investigate suspected abuse and suspend or remove affected
          accounts or embeds when reasonably necessary to protect users, third
          parties, or the Service.
        </p>
      </LegalSection>

      <LegalSection title="6. Plans, billing, and taxes">
        <p>
          The current demo does not process live payments. If paid plans are
          enabled, the checkout page will disclose the price, currency, billing
          interval, included features, renewal terms, and applicable taxes before
          you confirm a purchase. Payments will be processed by the provider
          identified at checkout.
        </p>
        <p>
          A recurring subscription will renew automatically only when that is
          clearly disclosed at checkout. You authorize the payment provider to
          charge the selected payment method for each billing period until the
          subscription is canceled. You are responsible for applicable taxes,
          except taxes imposed on our income.
        </p>
      </LegalSection>

      <LegalSection title="7. Cancellation and refunds">
        <p>
          You may cancel a paid subscription through the billing controls made
          available with the plan or by contacting support. Unless stated
          otherwise at checkout, cancellation takes effect at the end of the
          current paid period and access continues until then. Refund eligibility
          and processing are described in our{" "}
          <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>.
          Mandatory consumer rights always apply.
        </p>
      </LegalSection>

      <LegalSection title="8. Third-party services">
        <p>
          The Service interacts with third-party products including Google,
          Supabase, and Notion. Their services and content are governed by their
          own terms and policies. We do not control third-party availability,
          changes, or decisions. EmbedMyNotion is independent from and is not
          endorsed by Notion Labs, Inc.
        </p>
      </LegalSection>

      <LegalSection title="9. Intellectual property">
        <p>
          The Service, its software, branding, design, and documentation are
          owned by EmbedMyNotion or its licensors and are protected by applicable
          intellectual-property laws. These Terms grant you a limited,
          revocable, non-transferable right to use the Service according to your
          plan; they do not transfer ownership of the Service to you.
        </p>
      </LegalSection>

      <LegalSection title="10. Suspension and termination">
        <p>
          You may stop using the Service at any time. We may restrict or
          terminate access if you materially breach these Terms, create risk or
          legal exposure, fail to pay an amount due, or threaten the security or
          operation of the Service. Where reasonable, we will provide notice and
          an opportunity to correct the issue. Provisions that by their nature
          should survive termination will remain effective.
        </p>
      </LegalSection>

      <LegalSection title="11. Disclaimers">
        <p>
          The Service is provided on an &quot;as available&quot; basis. To the
          maximum extent permitted by law, we disclaim implied warranties of
          merchantability, fitness for a particular purpose, non-infringement,
          and uninterrupted or error-free operation. We do not guarantee that
          every Notion block, third-party integration, or host website will
          remain compatible. Nothing in these Terms excludes a warranty or right
          that cannot lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection title="12. Limitation of liability">
        <p>
          To the maximum extent permitted by law, EmbedMyNotion will not be liable
          for indirect, incidental, special, consequential, exemplary, or
          punitive damages, or for lost profits, revenue, goodwill, content, or
          data arising from use of the Service. Our aggregate liability relating
          to the Service will not exceed the greater of the amount you paid us
          during the three months before the event giving rise to the claim or
          US$50. These limitations do not apply where liability cannot legally be
          limited.
        </p>
      </LegalSection>

      <LegalSection title="13. Applicable law and disputes">
        <p>
          These Terms are governed by the laws applicable where the
          EmbedMyNotion operator is established, without overriding mandatory
          consumer protections that apply where you live. Before starting formal
          proceedings, you and EmbedMyNotion agree to make a reasonable effort
          to resolve the dispute through support.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes and contact">
        <p>
          We may update these Terms as the Service or law changes. The revised
          Terms will be posted here with a new effective date. If a change is
          material, we may also provide notice through the Service. Continued use
          after the effective date means you accept the revised Terms.
        </p>
        <p>
          Questions about these Terms can be submitted through the{" "}
          <a href={siteConfig.supportUrl}>{siteConfig.supportEmail}</a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
