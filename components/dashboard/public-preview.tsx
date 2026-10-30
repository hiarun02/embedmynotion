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
      <NotionPage recordMap={recordMap} theme={embed.theme} />
    </main>
  );
}
