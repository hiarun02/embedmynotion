import { Suspense } from "react";
import { ArrowRight, Code2, FileText } from "lucide-react";
import Link from "next/link";

import { hasLandingSession } from "@/lib/landing-session";

import { EmbedDemo } from "./EmbedDemo";

function HeroPrimaryAction({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <Link className="orange-button" href={isSignedIn ? "/dashboard" : "/login"}>
      {isSignedIn ? "Dashboard" : "Get started free"} <ArrowRight />
    </Link>
  );
}

async function AuthenticatedHeroAction() {
  const isSignedIn = await hasLandingSession();
  return <HeroPrimaryAction isSignedIn={isSignedIn} />;
}

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="site-frame hero-frame">
        <div className="hero-grid">
          <div className="hero-icon-field" aria-hidden="true">
            <span className="hero-floating-icon hero-page-icon"><FileText /></span>
            <span className="hero-floating-icon hero-embed-icon"><Code2 /></span>
            <span className="hero-floating-icon hero-notion-icon"><b>N</b></span>
          </div>

          <div className="hero-copy-wrap">
            <h1>
              <span className="hero-heading-line">
                Embed your Notion pages&nbsp;<span className="hero-accent">Anywhere.</span>
              </span>
            </h1>
            <p>Turn your Notion pages into beautiful, responsive website embeds. Customize the look, preview instantly, and publish in minutes.</p>
            <div className="hero-actions">
              <Suspense fallback={<HeroPrimaryAction isSignedIn />}>
                <AuthenticatedHeroAction />
              </Suspense>
              <a className="hero-secondary-ref" href="#how-it-works">See how it works</a>
            </div>
          </div>
        </div>

        <div className="demo-container"><EmbedDemo /></div>
      </div>
    </section>
  );
}
