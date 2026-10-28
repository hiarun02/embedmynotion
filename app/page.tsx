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

export const instant = false;

export default async function Home() {
  await connection();

  let isAuthenticated = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    isAuthenticated = Boolean(data?.claims);
  }

  return (
    <>
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
