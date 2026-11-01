import { NextResponse, type NextRequest } from "next/server";

import {
  createEmbedAccessToken,
  embedAccessCookieName,
  verifyEmbedPassword,
} from "@/lib/embed-access";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const formData = await request.formData();
  const password = formData.get("password");
  const embed = await prisma.embed.findFirst({
    where: { id, isActive: true },
    select: { passwordHash: true },
  });

  const redirectUrl = new URL(`/embed/${encodeURIComponent(id)}`, request.url);

  if (
    !embed?.passwordHash ||
    typeof password !== "string" ||
    !(await verifyEmbedPassword(password, embed.passwordHash))
  ) {
    redirectUrl.searchParams.set("access_error", "password");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const accessToken = createEmbedAccessToken(id, embed.passwordHash);
  redirectUrl.searchParams.set("access_token", accessToken);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });
  response.cookies.set(
    embedAccessCookieName(id),
    accessToken,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
      path: `/embed/${id}`,
    },
  );
  return response;
}
