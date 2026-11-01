import { Suspense } from "react";

import { NotionPage } from "@/components/notion/notion-page";
import { loadNotionPage } from "@/lib/notion";
import type { Embed } from "@/lib/dashboard-model";

function previewTheme(value: string | string[] | undefined): Embed["theme"] {
  return value === "dark" || value === "system" ? value : "light";
}

function previewFont(value: string | string[] | undefined): Embed["font"] {
  return value === "sans" || value === "serif" || value === "mono"
    ? value
    : "default";
}

async function Preview({
  searchParams,
}: {
  searchParams: Promise<{
    url?: string | string[];
    theme?: string | string[];
    font?: string | string[];
    customCss?: string | string[];
    customCssEnabled?: string | string[];
    showTopBar?: string | string[];
    showCoverImage?: string | string[];
    showPageHeader?: string | string[];
    fullHeight?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const notionUrl = typeof params.url === "string" ? params.url : "";
  const fullHeight = params.fullHeight === "1";
  const result = await loadPreview(notionUrl);

  if (result.ok) {
    return (
      <main
        className={`notion-embed-page${fullHeight ? " full-height-preview" : ""}`}
      >
        <NotionPage
          recordMap={result.recordMap}
          theme={previewTheme(params.theme)}
          font={previewFont(params.font)}
          customCss={typeof params.customCss === "string" ? params.customCss : ""}
          customCssEnabled={params.customCssEnabled === "1"}
          showTopBar={params.showTopBar === "1"}
          showCoverImage={params.showCoverImage !== "0"}
          showPageHeader={params.showPageHeader !== "0"}
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

async function loadPreview(notionUrl: string) {
  try {
    return { ok: true as const, recordMap: await loadNotionPage(notionUrl) };
  } catch {
    return { ok: false as const };
  }
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{
    url?: string | string[];
    theme?: string | string[];
    font?: string | string[];
    customCss?: string | string[];
    customCssEnabled?: string | string[];
    showTopBar?: string | string[];
    showCoverImage?: string | string[];
    showPageHeader?: string | string[];
    fullHeight?: string | string[];
  }>;
}) {
  return (
    <Suspense fallback={<div className="notion-loading">Loading Notion page…</div>}>
      <Preview searchParams={searchParams} />
    </Suspense>
  );
}
