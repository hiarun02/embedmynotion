"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";

export function Header({
  children,
  isAuthenticated,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
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
      className={`sticky top-0 z-40 border-b bg-white transition-[border-color,background-color] duration-220 dark:bg-[#080808] ${isScrolled
        ? "border-black/8 dark:border-white/12"
        : "border-transparent shadow-none"
        }`}
    >
      <div className="mx-auto flex h-17 w-[min(1200px,calc(100%-48px))] items-center gap-8.5 max-[760px]:h-15.5 max-[760px]:w-[min(600px,calc(100%-32px))]">
        <a href="#top" aria-label="embedmynotion home">{children}</a>
        <div className="ml-auto flex flex-nowrap items-center justify-end gap-8.5 whitespace-nowrap max-[760px]:hidden">
          <nav className="flex flex-nowrap items-center gap-7.5 [&_a]:text-[13px] [&_a]:font-medium [&_a]:text-[#565656] [&_a:hover]:text-[#e94b12] dark:[&_a]:text-[#a5a5a5] dark:[&_a:hover]:text-[#ff7a45]" aria-label="Primary navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex shrink-0 items-center gap-5">
            <Button
              render={
                <Link href={isAuthenticated ? "/dashboard" : "/login"} />
              }
              nativeButton={false}
              className="h-9 rounded-[7px] px-4"
            >
              {isAuthenticated ? "Dashboard" : "Get started free"}
            </Button>
          </div>
        </div>
        <MobileNav isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}
