import "server-only";

import { cache } from "react";
import { NotionAPI } from "notion-client";

import { validNotionUrl } from "@/lib/dashboard-model";

const notion = new NotionAPI({
  ofetchOptions: {
    timeout: 15_000,
    retry: 1,
  },
});

export function notionPageId(value: string) {
  if (!validNotionUrl(value)) return null;

  const url = new URL(value);
  const compactPath = url.pathname.replaceAll("-", "");
  const pathMatch = compactPath.match(/[0-9a-f]{32}/i);
  if (pathMatch) return pathMatch[0].toLowerCase();

  const queryId = url.searchParams.get("p")?.replaceAll("-", "");
  return queryId && /^[0-9a-f]{32}$/i.test(queryId)
    ? queryId.toLowerCase()
    : null;
}

export const loadNotionPage = cache(async (notionUrl: string) => {
  const pageId = notionPageId(notionUrl);
  if (!pageId) throw new Error("This Notion URL does not contain a page ID.");

  return notion.getPage(pageId);
});
