import type { Metadata } from "next";
import { connection } from "next/server";

import { Logo } from "@/app/components/Logo";
import { Footer } from "@/app/components/landing-page/Footer";
import { Header } from "@/app/components/landing-page/Header";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Notion Embed Guides & Publishing Tips",
  description:
    "Learn how to embed Notion pages on websites, improve responsive layouts, configure secure access, and publish polished Notion content with practical guides.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Notion Embed Guides & Publishing Tips",
    description:
      "Practical guides for responsive Notion embeds, secure sharing, layout customization, and web publishing.",
    url: "/blog",
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "EmbedMyNotion guides for responsive Notion embeds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notion Embed Guides & Publishing Tips",
    description:
      "Practical guides for responsive Notion embeds, secure sharing, layout customization, and web publishing.",
    images: ["/opengraph-image"],
  },
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
