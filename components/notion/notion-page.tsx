"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "react-notion-x";
import { Code } from "react-notion-x/third-party/code";
import { Collection } from "react-notion-x/third-party/collection";
import { Equation } from "react-notion-x/third-party/equation";

import type { Embed } from "@/lib/dashboard-model";

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
}) {
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const darkMode = theme === "dark" || (theme === "system" && systemDark);
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
          components={{ Code, Collection, Equation }}
          mapPageUrl={(pageId) => `https://www.notion.so/${pageId}`}
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
