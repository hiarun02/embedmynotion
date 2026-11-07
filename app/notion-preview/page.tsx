import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { NotionPage } from "@/components/notion/notion-page";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { normalizeNotionPageId } from "@/lib/identifiers";
import { loadAuthorizedNotionPage } from "@/lib/notion";
import type { Embed } from "@/lib/dashboard-model";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Notion embed preview",
  robots: { index: false, follow: false, noarchive: true },
};

function previewTheme(value: string | string[] | undefined): Embed["theme"] {
  return value === "dark" || value === "system" ? value : "light";
}

function previewFont(value: string | string[] | undefined): Embed["font"] {
  return value === "sans" || value === "serif" || value === "mono"
    ? value
    : "default";
}

function previewCustomCss(value: string | string[] | undefined) {
  if (typeof value !== "string") return "";
  const css = value.trim();
  return css.length <= 4000 && !/<\/style/i.test(css) ? css : "";
}

type PreviewSearchParams = {
  url?: string | string[];
  theme?: string | string[];
  font?: string | string[];
  customCss?: string | string[];
  customCssEnabled?: string | string[];
  showTopBar?: string | string[];
  showCoverImage?: string | string[];
  showPageHeader?: string | string[];
  fullHeight?: string | string[];
  page?: string | string[];
};

function previewPageUrlPrefix(params: PreviewSearchParams) {
  const query = new URLSearchParams();
  const keys = [
    "url",
    "theme",
    "font",
    "customCss",
    "customCssEnabled",
    "showTopBar",
    "showCoverImage",
    "showPageHeader",
    "fullHeight",
  ] as const;

  for (const key of keys) {
    const value = params[key];
    if (typeof value === "string") query.set(key, value);
  }

  query.set("page", "");
  return `/notion-preview?${query.toString()}`;
}

async function Preview({
  searchParams,
}: {
  searchParams: Promise<PreviewSearchParams>;
}) {
  // Supabase validates the session against the current time. Keep that
  // request-specific work out of the Cache Components prerender pass.
  await connection();

  const params = await searchParams;
  const user = await getAuthenticatedUser();

  if (!user) {
    return (
      <div className="notion-load-error">
        <h1>Preview session expired</h1>
        <p>Sign in to the dashboard again to load this private preview.</p>
      </div>
    );
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });
  const hasProPlan = hasProAccess(subscription);
  const notionUrl = typeof params.url === "string" ? params.url : "";
  const fullHeight = params.fullHeight === "1";
  const pageId = normalizeNotionPageId(params.page);
  const customCss = hasProPlan ? previewCustomCss(params.customCss) : "";
  const result = await loadPreview(notionUrl, pageId);

  if (result.ok) {
    return (
      <main
        className={`notion-embed-page${fullHeight ? " full-height-preview" : ""}`}
      >
        <NotionPage
          recordMap={result.recordMap}
          theme={previewTheme(params.theme)}
          font={hasProPlan ? previewFont(params.font) : "default"}
          customCss={customCss}
          customCssEnabled={
            hasProPlan && params.customCssEnabled === "1" && Boolean(customCss)
          }
          showTopBar={hasProPlan && params.showTopBar === "1"}
          showCoverImage={hasProPlan ? params.showCoverImage !== "0" : true}
          showPageHeader={hasProPlan ? params.showPageHeader !== "0" : true}
          hideWatermark={hasProPlan}
          reportPageIcon
          pageUrlPrefix={previewPageUrlPrefix(params)}
        />
      </main>
    );
  }

  return (
    <div className="notion-load-error">
      <h1>Unable to load this Notion page</h1>
      <p>Confirm the page is published to the web, then check its URL.</p>
    </div>
  );
}

async function loadPreview(notionUrl: string, pageId: string | null) {
  try {
    return {
      ok: true as const,
      recordMap: await loadAuthorizedNotionPage(notionUrl, pageId),
    };
  } catch (error) {
    console.error("Notion preview load failed:", error);
    return { ok: false as const };
  }
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<PreviewSearchParams>;
}) {
  return (
    <Suspense fallback={<div className="notion-loading">Loading Notion page…</div>}>
      <Preview searchParams={searchParams} />
    </Suspense>
  );
}
