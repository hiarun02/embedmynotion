import type { MetadataRoute } from "next";

import { absoluteUrl, getSiteUrl } from "@/lib/site-config";

const PRIVATE_PATHS = [
  "/api",
  "/auth",
  "/dashboard",
  "/embed",
  "/login",
  "/notion-preview",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot-Extended",
          "Google-Extended",
        ],
        allow: ["/", "/blog/"],
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: getSiteUrl(),
  };
}
