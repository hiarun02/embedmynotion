"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "react-notion-x";
import { Code } from "react-notion-x/third-party/code";
import { Collection } from "react-notion-x/third-party/collection";
import { Equation } from "react-notion-x/third-party/equation";

import type { Embed } from "@/lib/dashboard-model";
import "react-notion-x/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

function NotionPdf({ file }: { file: string }) {
  return (
    <iframe
      className="notion-pdf-frame"
      src={file}
      title="PDF document"
      loading="lazy"
    />
  );
}

function NotionTweet({ id }: { id: string }) {
  return (
    <a
      className="notion-tweet-link"
      href={`https://x.com/i/web/status/${encodeURIComponent(id)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span aria-hidden="true">𝕏</span>
      <span>
        <strong>View post on X</strong>
        <small>Open the original post in a new tab</small>
      </span>
    </a>
  );
}

export function NotionPage({
  recordMap,
  theme,
  font = "default",
  customCss = "",
  customCssEnabled = false,
  showTopBar = false,
  showCoverImage = true,
  showPageHeader = true,
  hideWatermark = false,
  reportPageIcon = false,
  pageUrlPrefix,
}: {
  recordMap: ExtendedRecordMap;
  theme: Embed["theme"];
  font?: Embed["font"];
  customCss?: string;
  customCssEnabled?: boolean;
  showTopBar?: boolean;
  showCoverImage?: boolean;
  showPageHeader?: boolean;
  hideWatermark?: boolean;
  reportPageIcon?: boolean;
  pageUrlPrefix?: string;
}) {
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!reportPageIcon || window.parent === window) return;

    const icon = document.querySelector<HTMLElement>(
      ".notion-page-icon-hero .notion-page-icon",
    );
    const image = icon instanceof HTMLImageElement ? icon.currentSrc || icon.src : "";
    const emoji = image ? "" : icon?.textContent?.trim() || "";

    window.parent.postMessage(
      {
        type: "embedmynotion:page-icon",
        icon: image
          ? { kind: "image", value: image }
          : emoji
            ? { kind: "emoji", value: emoji }
            : null,
      },
      window.location.origin,
    );
  }, [recordMap, reportPageIcon]);

  const darkMode = theme === "dark" || (theme === "system" && systemDark);
  const mapPageUrl = useCallback(
    (pageId: string) =>
      pageUrlPrefix
        ? `${pageUrlPrefix}${encodeURIComponent(pageId)}`
        : `https://www.notion.so/${pageId}`,
    [pageUrlPrefix],
  );
  const fontFamily =
    font === "sans"
      ? "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      : font === "serif"
        ? "Georgia, 'Times New Roman', serif"
        : font === "mono"
          ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  return (
    <>
      <style>{`
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .notion {
          font-family: ${fontFamily} !important;
        }
        .embed-hide-cover .notion-page-cover-wrapper {
          display: none !important;
        }
        .embed-hide-cover .notion-page-has-cover {
          margin-top: 48px !important;
          padding-top: 96px;
        }
        .embed-hide-cover .notion-page-has-cover.notion-page-no-icon {
          padding-top: 0;
        }
        .embed-hide-cover .notion-page-icon-hero {
          top: 0 !important;
        }
        .embed-hide-page-header .notion-title,
        .embed-hide-page-header .notion-page-icon-hero {
          display: none !important;
        }
        .embed-hide-page-header .notion-page {
          padding-top: 48px !important;
        }
        .embed-hide-page-header.embed-hide-cover .notion-page {
          padding-top: 0 !important;
        }
        .notion-tweet-link {
          display: flex;
          width: min(100%, 420px);
          align-items: center;
          gap: 14px;
          margin: 8px auto;
          border: 1px solid rgba(127, 127, 127, .28);
          border-radius: 14px;
          padding: 18px;
          color: inherit;
          text-decoration: none;
        }
        .notion-tweet-link:hover {
          background: rgba(127, 127, 127, .08);
        }
        .notion-tweet-link > span:first-child {
          font-size: 24px;
        }
        .notion-tweet-link > span:last-child {
          display: grid;
          gap: 3px;
        }
        .notion-tweet-link small {
          opacity: .65;
        }
        .notion-pdf-frame {
          display: block;
          width: 100%;
          min-height: 640px;
          border: 0;
          background: #fff;
        }
        ${customCssEnabled ? customCss : ""}
      `}</style>
      <div
        className={`notion-render-shell${showCoverImage ? "" : " embed-hide-cover"}${showPageHeader ? "" : " embed-hide-page-header"}`}
      >
        <NotionRenderer
          recordMap={recordMap}
          fullPage
          darkMode={darkMode}
          disableHeader={!showTopBar}
          previewImages
          components={{
            Code,
            Collection,
            Equation,
            Pdf: NotionPdf,
            Tweet: NotionTweet,
          }}
          mapPageUrl={mapPageUrl}
        />
        {!hideWatermark ? (
          <a
            className={`notion-brand-watermark${darkMode ? " dark" : ""}`}
            href="/"
            target="_blank"
            rel="noreferrer"
            aria-label="Made in EmbedMyNotion"
          >
            <span aria-hidden="true">
              <Image src="/icon.svg" alt="" width={24} height={24} />
            </span>
            Made in EmbedMyNotion
          </a>
        ) : null}
      </div>
    </>
  );
}
