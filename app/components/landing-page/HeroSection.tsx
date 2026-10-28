import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmbedDemo } from "./EmbedDemo";

export function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="hero-section">
      <div className="site-container hero-copy-wrap">
        <h1>
          <span className="hero-heading-line">
            Embed your Notion pages <span className="hero-accent">Anywhere.</span>
          </span>
        </h1>
        <p>Turn your Notion pages into beautiful, responsive website embeds. Customize the look, preview instantly, and publish in minutes.</p>
        <div className="hero-actions">
          <Button
            render={
              <Link href={isAuthenticated ? "/dashboard" : "/login"} />
            }
            nativeButton={false}
            size="lg"
            className="hero-primary"
          >
            {isAuthenticated ? "Dashboard" : "Get started free"} <ArrowRight />
          </Button>
          <Button render={<a href="#how-it-works" />} nativeButton={false} size="lg" variant="outline" className="hero-secondary">See how it works</Button>
        </div>
      </div>
      <div className="site-container demo-container"><EmbedDemo /></div>
    </section>
  );
}
