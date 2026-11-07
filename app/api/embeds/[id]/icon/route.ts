import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { loadNotionPageIcon } from "@/lib/notion";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { message: "Please sign in again." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const embed = await prisma.embed.findFirst({
    where: { id, userId: user.id },
    select: { notionUrl: true },
  });

  if (!embed) {
    return NextResponse.json({ message: "Embed not found." }, { status: 404 });
  }

  try {
    const icon = await loadNotionPageIcon(embed.notionUrl);
    return NextResponse.json(
      { icon },
      { headers: { "Cache-Control": "private, max-age=300" } },
    );
  } catch (error) {
    console.error("Notion page icon load failed:", error);
    return NextResponse.json({ icon: null });
  }
}
