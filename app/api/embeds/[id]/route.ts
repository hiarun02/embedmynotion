import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { serializeEmbed } from "@/lib/dashboard-model";
import { databaseTheme, parseEmbedInput } from "@/lib/embed-input";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { message: "Please sign in again." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!validId(id)) {
    return NextResponse.json({ message: "Embed not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const input = parseEmbedInput(body);
  if (!input) {
    return NextResponse.json(
      { message: "Check the embed name, Notion URL, and appearance settings." },
      { status: 400 },
    );
  }

  const ownedEmbed = await prisma.embed.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!ownedEmbed) {
    return NextResponse.json({ message: "Embed not found." }, { status: 404 });
  }

  try {
    const embed = await prisma.embed.update({
      where: { id },
      data: {
        title: input.title,
        notionUrl: input.notionUrl,
        theme: databaseTheme(input.theme),
        height: input.height,
        fullWidth: input.fullWidth,
        width: input.width,
        fullHeight: input.fullHeight,
        border: input.border,
        borderWidth: input.borderWidth,
        borderColor: input.borderColor,
        borderRadius: input.radius,
        isActive: input.active,
      },
    });

    return NextResponse.json({ embed: serializeEmbed(embed) });
  } catch (error) {
    console.error("Embed update failed:", error);
    return NextResponse.json(
      { message: "Your changes could not be saved. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { message: "Please sign in again." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!validId(id)) {
    return NextResponse.json({ message: "Embed not found." }, { status: 404 });
  }

  try {
    const result = await prisma.embed.deleteMany({
      where: { id, userId: user.id },
    });
    if (result.count === 0) {
      return NextResponse.json({ message: "Embed not found." }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Embed deletion failed:", error);
    return NextResponse.json(
      { message: "The embed could not be deleted. Please try again." },
      { status: 500 },
    );
  }
}
