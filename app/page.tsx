import {
  FaqSection,
  FeaturesSection,
  Footer,
  Header,
  HeroSection,
  HowItWorksSection,
  ProblemSection,
  UseCasesSection,
} from "@/app/components/landing-page";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
