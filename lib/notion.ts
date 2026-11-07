import "server-only";

import { cacheLife } from "next/cache";
import { NotionAPI } from "notion-client";
import {
  getBlockIcon,
  getBlockTitle,
  getBlockValue,
  idToUuid,
  resolveDefaultImageUrl,
} from "notion-utils";

import { notionPageId, validNotionUrl } from "@/lib/dashboard-model";
import { normalizeNotionPageId } from "@/lib/identifiers";
import { isAuthorizedNotionSubpage } from "@/lib/notion-authorization";

const notion = new NotionAPI({
  ofetchOptions: {
    timeout: 15_000,
    retry: 1,
  },
});

export type NotionPageIcon =
  | { kind: "emoji"; value: string }
  | { kind: "image"; value: string };

export type NotionPageMetadata = {
  title: string;
  icon: NotionPageIcon | null;
};

const NOTION_REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const MAX_NOTION_REDIRECTS = 4;

async function fetchPublishedNotionPage(initialUrl: string) {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; ; redirectCount += 1) {
    if (!validNotionUrl(currentUrl)) {
      throw new Error("Use a published Notion page URL.");
    }

    const response = await fetch(currentUrl, {
      headers: {
        accept: "text/html",
        "user-agent": "EmbedMyNotion/1.0",
      },
      redirect: "manual",
      next: { revalidate: 3600 },
    });

    if (!NOTION_REDIRECT_STATUSES.has(response.status)) return response;
    if (redirectCount >= MAX_NOTION_REDIRECTS) {
      throw new Error("The Notion page redirected too many times.");
    }

    const location = response.headers.get("location");
    if (!location) throw new Error("The Notion page returned an invalid redirect.");

    try {
      currentUrl = new URL(location, currentUrl).toString();
    } catch {
      throw new Error("The Notion page returned an invalid redirect.");
    }
  }
}

async function resolveNotionPageId(notionUrl: string) {
  if (!validNotionUrl(notionUrl)) {
    throw new Error("Use a published Notion page URL.");
  }

  const pageId = notionPageId(notionUrl);
  if (pageId) return pageId;

  // Newer Notion Sites may expose a clean page slug without the page UUID.
  // Notion includes the resolved UUID in its public-page redirect metadata.
  const response = await fetchPublishedNotionPage(notionUrl);

  if (!response.ok) {
    throw new Error(`Notion page returned HTTP ${response.status}.`);
  }

  const redirectedPageId = notionPageId(response.url);
  if (redirectedPageId) return redirectedPageId;

  const html = await response.text();
  const metadataMatch = html.match(
    /requiredRedirectMetadata",\s*\{\s*"pageId"\s*:\s*"([0-9a-f-]{36})"/i,
  );
  const resolvedPageId = metadataMatch?.[1]?.replaceAll("-", "").toLowerCase();

  if (!resolvedPageId || !/^[0-9a-f]{32}$/.test(resolvedPageId)) {
    throw new Error(
      "This Notion URL does not resolve to a public page. Copy the published page URL and try again.",
    );
  }

  return resolvedPageId;
}

async function loadNotionPageRecord(pageId: string) {
  "use cache";
  cacheLife("seconds");

  return notion.getPage(pageId, {
    fetchCollections: true,
    fetchMissingBlocks: true,
    fetchRelationPages: true,
    signFileUrls: true,
  });
}

export async function loadNotionPage(notionUrl: string) {
  const pageId = await resolveNotionPageId(notionUrl);
  return loadNotionPageRecord(pageId);
}

export async function loadNotionPageById(value: string) {
  const pageId = normalizeNotionPageId(value);
  if (!pageId) throw new Error("Invalid Notion page ID.");

  return loadNotionPageRecord(pageId);
}

export async function loadAuthorizedNotionPage(
  notionUrl: string,
  requestedPageId: string | null,
) {
  const rootPageId = await resolveNotionPageId(notionUrl);
  const rootRecordMap = await loadNotionPageRecord(rootPageId);

  if (!requestedPageId || requestedPageId === rootPageId) {
    return rootRecordMap;
  }

  if (
    !isAuthorizedNotionSubpage(
      rootRecordMap,
      rootPageId,
      requestedPageId,
    )
  ) {
    throw new Error("This page is not contained in the configured Notion page.");
  }

  return loadNotionPageRecord(requestedPageId);
}

async function loadNotionPageMetadataRecord(
  notionUrl: string,
): Promise<NotionPageMetadata> {
  "use cache";
  cacheLife("hours");

  const pageId = await resolveNotionPageId(notionUrl);
  const recordMap = await notion.getPage(pageId, {
    fetchCollections: false,
    fetchMissingBlocks: false,
    fetchRelationPages: false,
    signFileUrls: false,
    chunkLimit: 10,
  });
  const rootBlock =
    getBlockValue(recordMap.block[idToUuid(pageId)]) ??
    getBlockValue(Object.values(recordMap.block)[0]);

  if (!rootBlock) {
    throw new Error("The Notion page did not return a root block.");
  }

  const title = getBlockTitle(rootBlock, recordMap)?.trim() ?? "";

  const icon = getBlockIcon(rootBlock, recordMap)?.trim();
  if (!icon) return { title, icon: null };

  const isImage =
    icon.startsWith("http://") ||
    icon.startsWith("https://") ||
    icon.startsWith("data:") ||
    icon.startsWith("/") ||
    icon.startsWith("attachment:");

  if (!isImage) {
    return { title, icon: { kind: "emoji", value: icon } };
  }

  const imageUrl = resolveDefaultImageUrl(icon, rootBlock, {
    signedUrls: recordMap.signed_urls,
    isPublic: true,
  });

  return {
    title,
    icon: imageUrl ? { kind: "image", value: imageUrl } : null,
  };
}

export async function loadNotionPageMetadata(
  notionUrl: string,
): Promise<NotionPageMetadata> {
  return loadNotionPageMetadataRecord(notionUrl);
}

export async function loadNotionPageIcon(
  notionUrl: string,
): Promise<NotionPageIcon | null> {
  return (await loadNotionPageMetadata(notionUrl)).icon;
}
