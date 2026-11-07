import type { ReactNode } from "react";

import { Logo } from "@/app/components/Logo";
import { Footer } from "@/app/components/landing-page/Footer";
import { Header } from "@/app/components/landing-page/Header";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header>
        <Logo />
      </Header>
      {children}
      <Footer />
    </>
  );
}
