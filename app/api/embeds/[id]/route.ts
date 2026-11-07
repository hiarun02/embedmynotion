import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { serializeEmbed } from "@/lib/dashboard-model";
import { hashEmbedPassword } from "@/lib/embed-access";
import {
  databaseFont,
  databaseTheme,
  parseEmbedInput,
  usesPremiumFeatures,
} from "@/lib/embed-input";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/subscription";

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

  const [ownedEmbed, subscription] = await Promise.all([
    prisma.embed.findFirst({
      where: { id, userId: user.id },
      select: { id: true, passwordHash: true },
    }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
  ]);
  if (!ownedEmbed) {
    return NextResponse.json({ message: "Embed not found." }, { status: 404 });
  }

  const hasProPlan = hasProAccess(subscription);

  if (!hasProPlan && usesPremiumFeatures(input)) {
    return NextResponse.json(
      { message: "Upgrade to Pro to use appearance, layout, or security controls." },
      { status: 403 },
    );
  }

  if (
    input.passwordProtected &&
    !input.password &&
    !ownedEmbed.passwordHash
  ) {
    return NextResponse.json(
      { message: "Choose a password with at least 6 characters." },
      { status: 400 },
    );
  }

  try {
    const embed = await prisma.embed.update({
      where: { id },
      data: {
        title: input.title,
        notionUrl: input.notionUrl,
        theme: databaseTheme(input.theme),
        font: databaseFont(input.font),
        customCssEnabled: input.customCssEnabled,
        customCss: input.customCssEnabled ? input.customCss : null,
        showTopBar: input.showTopBar,
        showCoverImage: input.showCoverImage,
        showPageHeader: input.showPageHeader,
        passwordHash: input.passwordProtected
          ? input.password
            ? await hashEmbedPassword(input.password)
            : ownedEmbed.passwordHash
          : null,
        emailAccess: input.emailAccess,
        allowedEmails: input.emailAccess ? input.allowedEmails : [],
        height: input.height,
        fullWidth: input.fullWidth,
        width: input.width,
        fullHeight: input.fullHeight,
        border: input.border,
        borderWidth: input.borderWidth,
        borderColor: input.borderColor,
        borderRadius: input.radius,
        backgroundStyle: input.backgroundStyle,
        isActive: input.active,
      },
    });

    return NextResponse.json({
      embed: serializeEmbed(embed, { hasProAccess: hasProPlan }),
    });
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
