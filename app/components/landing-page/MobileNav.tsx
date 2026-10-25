"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
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
  ["Features", "#features"],
  ["How it works", "#how-it-works"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
];

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" className="mobile-menu" aria-label="Open navigation" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent className="mobile-sheet">
        <SheetHeader>
          <SheetTitle>embedmynotion</SheetTitle>
          <SheetDescription>Notion pages, beautifully embedded.</SheetDescription>
        </SheetHeader>
        <nav className="mobile-links" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <SheetClose key={href} render={<a href={href} />}>{label}</SheetClose>
          ))}
        </nav>
        <div className="mobile-sheet-actions">
          <SheetClose nativeButton={false} render={<Link href="/dashboard" className="btn btn-primary" />}>Get started free</SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
