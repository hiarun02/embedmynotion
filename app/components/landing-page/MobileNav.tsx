"use client";

import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  CircleHelp,
  Menu,
  Sparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";

import { LogoMark } from "@/app/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { label: "Features", href: "/#features", icon: Sparkles },
  { label: "How it works", href: "/#how-it-works", icon: Workflow },
  { label: "Pricing", href: "/#pricing", icon: BadgeDollarSign },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "FAQ", href: "/#faq", icon: CircleHelp },
];

export function MobileNav({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" className="mobile-nav-trigger ml-auto hidden max-[760px]:inline-flex" aria-label="Open navigation" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent className="mobile-nav-panel">
        <SheetHeader className="mobile-nav-header">
          <LogoMark className="mobile-nav-logo" />
          <div>
            <SheetTitle className="mobile-nav-title">EmbedMyNotion</SheetTitle>
            <SheetDescription className="mobile-nav-description">
              Notion pages, beautifully embedded.
            </SheetDescription>
          </div>
        </SheetHeader>
        <nav className="mobile-nav-links" aria-label="Mobile navigation">
          {links.map(({ label, href, icon: Icon }) => (
            <SheetClose
              key={href}
              nativeButton={false}
              render={<Link href={href} />}
            >
              <span className="mobile-nav-link-icon" aria-hidden="true">
                <Icon />
              </span>
              <span>{label}</span>
            </SheetClose>
          ))}
        </nav>
        <div className="mobile-nav-action">
          <SheetClose
            nativeButton={false}
            render={
              <Link
                href={isSignedIn ? "/dashboard" : "/login"}
                className="mobile-nav-primary"
              />
            }
          >
            <span>{isSignedIn ? "Dashboard" : "Get started free"}</span>
            <ArrowRight aria-hidden="true" />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
