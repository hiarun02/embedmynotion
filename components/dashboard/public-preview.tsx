import type { Embed } from "@/lib/dashboard-model";
import type { ExtendedRecordMap } from "notion-types";
import { NotionPage } from "@/components/notion/notion-page";

export function PublicPreview({
  embed,
  recordMap,
}: {
  embed: Embed;
  recordMap: ExtendedRecordMap;
}) {
  return (
    <main className="notion-embed-page">
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
      />
    </main>
  );
}
