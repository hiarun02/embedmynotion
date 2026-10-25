"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let frameId = 0;

    function handleScroll() {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const distance = currentScrollY - lastScrollY.current;
        setIsScrolled(currentScrollY > 12);

        if (currentScrollY <= 12) {
          setIsVisible(true);
        } else if (Math.abs(distance) >= 6) {
          setIsVisible(distance < 0);
        }

        lastScrollY.current = currentScrollY;
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
    <header className={`site-header ${isVisible ? "is-visible" : "is-hidden"} ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="site-container nav-inner">
        <a href="#top" aria-label="embedmynotion home"><Logo /></a>
        <div className="desktop-header-actions">
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <Button render={<Link href="/dashboard" />} nativeButton={false} className="nav-cta">Get started free</Button>
          </div>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
