import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { LegalPage, LegalSection } from "../legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn what information EmbedMyNotion processes, why it is used, and the choices available to you.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy",
    description:
      "How EmbedMyNotion collects, uses, protects, and shares information.",
    url: "/privacy",
    siteName: siteConfig.name,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Legal"
      title="Privacy Policy"
      introduction="This policy explains what information EmbedMyNotion processes when you use the website, dashboard, and published embed service."
    >
      <LegalSection title="1. Scope and who we are">
        <p>
          This Privacy Policy applies to EmbedMyNotion&apos;s website, account
          dashboard, APIs, and public embed pages (together, the
          &quot;Service&quot;). In this policy, &quot;EmbedMyNotion,&quot;
          &quot;we,&quot; and &quot;us&quot; refer to the team operating the
          Service.
        </p>
        <p>
          EmbedMyNotion is an independent product. It is not operated by,
          endorsed by, or affiliated with Notion Labs, Inc.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we process">
        <h3>Account information</h3>
        <p>
          When you sign in with Google, our authentication provider may give us
          your account identifier, name, email address, profile image, and basic
          authentication metadata. We store the information needed to create and
          maintain your EmbedMyNotion account.
        </p>
        <h3>Embed information</h3>
        <p>
          We process the public Notion page URL you submit, the name you give an
          embed, its generated identifier, and the appearance, layout, status,
          and access settings you choose. To render an embed, the Service
          retrieves content and assets from the public Notion page.
        </p>
        <h3>Security information</h3>
        <p>
          If you protect an embed with a password, we store a salted password
          hash rather than the password itself. If you enable approved-email
          access, we store the email addresses you enter. You are responsible
          for having an appropriate basis to provide those addresses to us.
        </p>
        <h3>Technical information</h3>
        <p>
          We may process request details such as IP address, browser and device
          information, timestamps, requested pages, and error information for
          security, diagnostics, and reliable delivery. For password-unlock rate
          limiting, an IP-derived one-way hash is stored temporarily rather than
          the raw address in the rate-limit record.
        </p>
        <h3>Billing information</h3>
        <p>
          If paid plans become available, the checkout provider will process
          payment-card and billing details under its own privacy policy. We may
          receive transaction identifiers, plan, billing interval, payment
          status, and subscription dates, but we do not intend to store complete
          payment-card numbers.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <ul>
          <li>Provide authentication, accounts, embeds, previews, and access controls.</li>
          <li>Retrieve and display the public Notion content you choose to embed.</li>
          <li>Save your settings and synchronize account and subscription status.</li>
          <li>Prevent abuse, enforce limits, investigate errors, and protect the Service.</li>
          <li>Respond to support, privacy, and billing requests.</li>
          <li>Comply with legal obligations and enforce our Terms of Service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Legal bases">
        <p>
          Where data-protection law requires a legal basis, we rely on
          performance of our agreement with you, our legitimate interests in
          operating and securing the Service, compliance with legal obligations,
          and consent where it is specifically requested. You may withdraw
          consent at any time, without affecting earlier lawful processing.
        </p>
      </LegalSection>

      <LegalSection title="5. How information is shared">
        <p>We may share limited information with:</p>
        <ul>
          <li>
            <strong>Google and Supabase</strong> for sign-in, authentication,
            account sessions, and hosted data services.
          </li>
          <li>
            <strong>Notion</strong> when the Service requests the public page and
            assets identified by the URL you submit.
          </li>
          <li>
            <strong>Hosting and infrastructure providers</strong> that deliver,
            monitor, secure, or maintain the Service.
          </li>
          <li>
            <strong>A payment provider</strong> if paid checkout is enabled, as
            disclosed during checkout.
          </li>
          <li>
            <strong>Authorities or professional advisers</strong> when reasonably
            necessary to comply with law, protect rights and safety, or address
            fraud and abuse.
          </li>
        </ul>
        <p>
          We do not sell personal information or share it for cross-context
          behavioral advertising.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies and local storage">
        <p>
          The Service uses essential cookies for authentication, session
          refresh, security, and remembering temporary access to a
          password-protected embed. These cookies are required for the requested
          features to work. We do not currently use advertising cookies. If we
          add optional analytics or marketing technologies, this policy and any
          required consent controls will be updated first.
        </p>
      </LegalSection>

      <LegalSection title="7. Retention and deletion">
        <p>
          We retain account and embed information while your account or embeds
          remain active and for as long as reasonably needed for support,
          security, dispute resolution, and legal compliance. Deleted embeds are
          removed from the active database, although limited copies may remain
          temporarily in backups or caches. Password rate-limit records are
          automatically cleared after their short security window and stale
          records are removed after approximately one day.
        </p>
        <p>
          You may request account deletion through our support channel. We may
          retain information that the law requires us to keep or that is needed
          to establish, exercise, or defend legal claims.
        </p>
      </LegalSection>

      <LegalSection title="8. Security">
        <p>
          We use reasonable technical and organizational safeguards, including
          access controls, hashed embed passwords, limited database privileges,
          and rate limiting. No online service is completely secure, so we
          cannot guarantee absolute security. Do not submit confidential Notion
          content: a source page must be published by Notion before the Service
          can retrieve it.
        </p>
      </LegalSection>

      <LegalSection title="9. Your rights and choices">
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, restrict, or object to processing of your personal information,
          and to receive a portable copy. You may update your profile and delete
          individual embeds from the dashboard. Other requests can be made
          through support. We may need to verify your identity before completing
          a request.
        </p>
      </LegalSection>

      <LegalSection title="10. International processing">
        <p>
          Our providers may process information in countries other than your
          own. Where required, we use provider commitments or other lawful
          safeguards intended to protect information transferred internationally.
        </p>
      </LegalSection>

      <LegalSection title="11. Children">
        <p>
          The Service is not directed to children under 13, and we do not
          knowingly collect their personal information. If you believe a child
          has provided information to us, contact support so we can investigate
          and delete it where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes and contact">
        <p>
          We may update this policy as the Service or law changes. We will post
          the revised version here and change the date above. Material changes
          may also be communicated through the Service.
        </p>
        <p>
          For privacy questions or requests, use the{" "}
          <a href={siteConfig.supportUrl}>{siteConfig.supportEmail}</a>
          . Please do not include passwords or confidential Notion content in a
          support request.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
