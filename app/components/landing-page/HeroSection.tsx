import { ArrowRight, Code2, Eye, FileText, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";

import { EmbedDemo } from "./EmbedDemo";

export function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
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
              <Link className="orange-button" href={isAuthenticated ? "/dashboard" : "/login"}>
                {isAuthenticated ? "Dashboard" : "Get started free"} <ArrowRight />
              </Link>
              <a className="hero-secondary-ref" href="#how-it-works">See how it works</a>
            </div>
          </div>
        </div>

        <div className="editor-intro">
          <div className="editor-intro-copy">
            <span className="editor-intro-label"><Sparkles /> LIVE EDITOR</span>
            <h2>Customize. Preview. Embed.</h2>
            <p>Fine-tune the details, see every change, then copy the code.</p>
          </div>
          <div className="editor-flow" aria-label="Editor workflow">
            <span><b>01</b><SlidersHorizontal /> Customize</span>
            <i aria-hidden="true" />
            <span><b>02</b><Eye /> Preview</span>
            <i aria-hidden="true" />
            <span><b>03</b><Code2 /> Embed</span>
          </div>
        </div>

        <div className="demo-container"><EmbedDemo /></div>
      </div>
    </section>
  );
}
