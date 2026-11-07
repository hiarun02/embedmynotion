import type { Metadata } from "next";

import { Logo } from "./components/Logo";
import { FaqSection } from "./components/landing-page/FaqSection";
import { FeaturesSection } from "./components/landing-page/FeaturesSection";
import { Footer } from "./components/landing-page/Footer";
import { Header } from "./components/landing-page/Header";
import { HeroSection } from "./components/landing-page/HeroSection";
import { HowItWorksSection } from "./components/landing-page/HowItWorksSection";
import { PricingSection } from "./components/landing-page/PricingSection";
import { ProblemSection } from "./components/landing-page/ProblemSection";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function Home() {
  const organizationId = absoluteUrl("/#organization");
  const websiteId = absoluteUrl("/#website");
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: siteConfig.name,
      url: absoluteUrl("/"),
      description: siteConfig.description,
      publisher: { "@id": organizationId },
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      description: siteConfig.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and a modern web browser",
      featureList: [
        "Responsive Notion page embeds",
        "Light and dark themes",
        "Custom width, height, border, and radius controls",
        "Password protection and email allowlists",
        "Embeddable iframe code",
      ],
      provider: { "@id": organizationId },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header>
        <Logo />
      </Header>
      <main id="top">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
