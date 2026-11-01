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
  ["Features", "/#features"],
  ["How it works", "/#how-it-works"],
  ["Pricing", "/#pricing"],
  ["Blog", "/blog"],
  ["FAQ", "/#faq"],
];

export function MobileNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" className="ml-auto hidden max-[760px]:inline-flex" aria-label="Open navigation" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent className="bg-background p-4.5">
        <SheetHeader>
          <SheetTitle>embedmynotion</SheetTitle>
          <SheetDescription>Notion pages, beautifully embedded.</SheetDescription>
        </SheetHeader>
        <nav className="mt-7 grid border-t border-border [&_a]:border-b [&_a]:border-border [&_a]:px-0.5 [&_a]:py-4.25 [&_a]:font-semibold" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <SheetClose key={href} render={<Link href={href} />}>{label}</SheetClose>
          ))}
        </nav>
        <div className="mt-auto grid gap-2.5">
          <SheetClose
            nativeButton={false}
            render={
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-(--button-primary) text-sm font-semibold text-(--primary-foreground) hover:bg-(--button-primary-hover)"
              />
            }
          >
            {isAuthenticated ? "Dashboard" : "Get started free"}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
