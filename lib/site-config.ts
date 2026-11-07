const LOCAL_SITE_URL = "http://localhost:3000";
const PRODUCTION_SITE_URL = "https://embedmynotion.com";

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
  const configuredUrl =
    normalizeSiteUrl(process.env.SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL);

  if (process.env.NODE_ENV === "production") {
    if (!configuredUrl) return PRODUCTION_SITE_URL;

    const hostname = new URL(configuredUrl).hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      return PRODUCTION_SITE_URL;
    }
  }

  return configuredUrl ?? LOCAL_SITE_URL;
}

export function appUrl(path: string, requestUrl?: string) {
  if (process.env.NODE_ENV !== "production" && requestUrl) {
    return new URL(path, new URL(requestUrl).origin);
  }

  return new URL(path, `${getSiteUrl()}/`);
}

export const siteConfig = {
  name: "EmbedMyNotion",
  shortName: "EmbedMyNotion",
  supportEmail: "hi@embedmynotion.com",
  supportUrl: "mailto:hi@embedmynotion.com",
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
  return appUrl(path).toString();
}
