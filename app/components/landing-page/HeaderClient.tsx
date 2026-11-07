"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { useState } from "react";

import { MobileNav } from "./MobileNav";

export function HeaderClient({
  children,
  isSignedIn,
}: {
  children: ReactNode;
  isSignedIn: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frameId = 0;

    function handleScroll() {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 12);
        frameId = 0;
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <header
      className={`landing-header ${isScrolled ? "is-scrolled" : ""}`}
    >
      <div className="landing-header-inner">
        <Link href="/" aria-label="EmbedMyNotion home">{children}</Link>
        <div className="desktop-navigation">
          <nav aria-label="Primary navigation">
            <Link href="/#features">Features</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/#faq">FAQ</Link>
          </nav>
          <div className="header-actions">
            <Link
              className="orange-button orange-button-small"
              href={isSignedIn ? "/dashboard" : "/login"}
            >
              {isSignedIn ? "Dashboard" : "Get started free"}
            </Link>
          </div>
        </div>
        <MobileNav isSignedIn={isSignedIn} />
      </div>
    </header>
  );
}
