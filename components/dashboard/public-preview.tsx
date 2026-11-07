import type { CSSProperties } from "react";
import type { Embed } from "@/lib/dashboard-model";
import type { ExtendedRecordMap } from "notion-types";
import { NotionPage } from "@/components/notion/notion-page";
import { embedBackgroundValue } from "@/lib/embed-background";

export function PublicPreview({
  embed,
  recordMap,
  pageUrlPrefix,
}: {
  embed: Embed;
  recordMap: ExtendedRecordMap;
  pageUrlPrefix: string;
}) {
  const hasBackgroundStyle = embed.backgroundStyle !== "none";

  return (
    <main
      className={`notion-embed-page${
        hasBackgroundStyle ? " has-background-style" : ""
      }`}
      style={
        {
          background: embedBackgroundValue(embed.backgroundStyle),
          "--embed-background-inset": hasBackgroundStyle
            ? "clamp(12px, 2vw, 24px)"
            : "0px",
          "--embed-background-total-inset": hasBackgroundStyle
            ? "clamp(24px, 4vw, 48px)"
            : "0px",
        } as CSSProperties
      }
    >
      <div className="notion-embed-surface">
        <NotionPage
          recordMap={recordMap}
          theme={embed.theme}
          font={embed.font}
          customCss={embed.customCss}
          customCssEnabled={embed.customCssEnabled}
          showTopBar={embed.showTopBar}
          showCoverImage={embed.showCoverImage}
          showPageHeader={embed.showPageHeader}
          hideWatermark={embed.hideWatermark}
          pageUrlPrefix={pageUrlPrefix}
        />
      </div>
    </main>
  );
}
