import { randomUUID } from "node:crypto";
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

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { message: "Please sign in again." },
      { status: 401 },
    );
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

  const [embedCount, subscription] = await Promise.all([
    prisma.embed.count({ where: { userId: user.id } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
  ]);
  const hasProPlan = hasProAccess(subscription);
  const limit = hasProPlan ? 25 : 1;

  if (!hasProPlan && usesPremiumFeatures(input)) {
    return NextResponse.json(
      { message: "Upgrade to Pro to use appearance, layout, or security controls." },
      { status: 403 },
    );
  }

  if (input.passwordProtected && !input.password) {
    return NextResponse.json(
      { message: "Choose a password with at least 6 characters." },
      { status: 400 },
    );
  }

  if (embedCount >= limit) {
    return NextResponse.json(
      {
        message: `Your ${hasProPlan ? "Pro" : "Free"} plan allows ${limit} embed${limit === 1 ? "" : "s"}.`,
      },
      { status: 409 },
    );
  }

  try {
    const id = randomUUID();
    const embed = await prisma.embed.create({
      data: {
        id,
        userId: user.id,
        slug: id,
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
          ? await hashEmbedPassword(input.password)
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

    return NextResponse.json(
      { embed: serializeEmbed(embed, { hasProAccess: hasProPlan }) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Embed creation failed:", error);
    return NextResponse.json(
      { message: "Your embed could not be created. Please try again." },
      { status: 500 },
    );
  }
}
