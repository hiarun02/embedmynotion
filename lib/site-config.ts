const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string | undefined) {
  if (!value?.trim()) return null;

  const candidate = /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;

  try {
    const url = new URL(candidate);
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    normalizeSiteUrl(process.env.SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL) ??
    FALLBACK_SITE_URL
  );
}

export const siteConfig = {
  name: "EmbedMyNotion",
  shortName: "EmbedMyNotion",
  title: "Embed Notion Pages on Any Website | EmbedMyNotion",
  description:
    "Turn public Notion pages into responsive website embeds. Customize the theme, layout, dimensions, and access controls, then publish in minutes.",
  locale: "en_US",
  keywords: [
    "embed Notion page",
    "Notion website embed",
    "Notion iframe",
    "responsive Notion embed",
    "custom Notion embed",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
