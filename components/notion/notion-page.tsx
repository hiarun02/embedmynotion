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
}: {
  recordMap: ExtendedRecordMap;
  theme: Embed["theme"];
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
      `}</style>
      <div className="notion-render-shell">
        <NotionRenderer
          recordMap={recordMap}
          fullPage
          darkMode={darkMode}
          disableHeader
          previewImages
          components={{ Code, Collection, Equation }}
          mapPageUrl={(pageId) => `https://www.notion.so/${pageId}`}
        />
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
      </div>
    </>
  );
}
