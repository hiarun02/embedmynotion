import type { Metadata } from "next";
import { connection } from "next/server";

import { Logo } from "./components/Logo";
import { FaqSection } from "./components/landing-page/FaqSection";
import { FeaturesSection } from "./components/landing-page/FeaturesSection";
import { Footer } from "./components/landing-page/Footer";
import { Header } from "./components/landing-page/Header";
import { HeroSection } from "./components/landing-page/HeroSection";
import { HowItWorksSection } from "./components/landing-page/HowItWorksSection";
import { ProblemSection } from "./components/landing-page/ProblemSection";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default async function Home() {
  await connection();

  let isAuthenticated = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    isAuthenticated = Boolean(data?.claims);
  }

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
      <Header isAuthenticated={isAuthenticated}>
        <Logo />
      </Header>
      <main id="top">
        <HeroSection isAuthenticated={isAuthenticated} />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
