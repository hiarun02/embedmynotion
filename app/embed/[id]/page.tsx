import { Suspense } from "react";
import { PublicPreview } from "@/components/dashboard/public-preview";
import { prisma } from "@/lib/prisma";
import { serializeEmbed } from "@/lib/dashboard-model";
import { loadNotionPage } from "@/lib/notion";
import "@/app/dashboard/dashboard.css";

async function loadPublicPage(notionUrl: string) {
  try {
    return { ok: true as const, recordMap: await loadNotionPage(notionUrl) };
  } catch {
    return { ok: false as const };
  }
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const embed = await prisma.embed.findFirst({
    where: { id, isActive: true },
  });

  if (!embed) {
    return (
      <div className="empty-state">
        <h1>Embed unavailable</h1>
        <p>This embed is inactive or has been deleted.</p>
      </div>
    );
  }

  const result = await loadPublicPage(embed.notionUrl);

  if (result.ok) {
    return (
      <PublicPreview embed={serializeEmbed(embed)} recordMap={result.recordMap} />
    );
  }

  return (
    <div className="notion-load-error">
      <h1>Notion page unavailable</h1>
      <p>Make sure the original Notion page is still published.</p>
    </div>
  );
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p>Loading embed…</p>}>
      <Content params={params} />
    </Suspense>
  );
}
