import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "react-notion-x/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Embed your Notion page into your website",
  description:
    "Embed Notion pages on any website. Customize their appearance, preview instantly, and generate embed code in minutes.",
  openGraph: {
    title: "Embed your Notion page into your website",
    description:
      "Customize beautiful, responsive Notion embeds and add them to your website in minutes.",
    type: "website",
    siteName: "embedmynotion",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
