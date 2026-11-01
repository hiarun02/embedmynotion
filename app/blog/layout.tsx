import type { Metadata } from "next";
import { connection } from "next/server";

import { Logo } from "@/app/components/Logo";
import { Footer } from "@/app/components/landing-page/Footer";
import { Header } from "@/app/components/landing-page/Header";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog | EmbedMyNotion",
  description: "Practical guides for publishing and presenting Notion pages on the web.",
};

export const instant = false;

export default async function BlogLayout({ children }: LayoutProps<"/blog">) {
  await connection();

  let isAuthenticated = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    isAuthenticated = Boolean(data?.claims);
  }

  return (
    <>
      <Header isAuthenticated={isAuthenticated}>
        <Logo />
      </Header>
      {children}
      <Footer />
    </>
  );
}
