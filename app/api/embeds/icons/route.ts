import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { loadNotionPageIcon, type NotionPageIcon } from "@/lib/notion";
import { prisma } from "@/lib/prisma";

const ICON_CONCURRENCY = 5;

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { message: "Please sign in again." },
      { status: 401 },
    );
  }

  const embeds = await prisma.embed.findMany({
    where: { userId: user.id },
    select: { id: true, notionUrl: true },
    take: 25,
  });
  const icons: Record<string, NotionPageIcon | null> = {};

  for (let index = 0; index < embeds.length; index += ICON_CONCURRENCY) {
    const batch = embeds.slice(index, index + ICON_CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (embed) => {
        try {
          return await loadNotionPageIcon(embed.notionUrl);
        } catch {
          return null;
        }
      }),
    );

    batch.forEach((embed, batchIndex) => {
      icons[embed.id] = results[batchIndex];
    });
  }

  return NextResponse.json(
    { icons },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
