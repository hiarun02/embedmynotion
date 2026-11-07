import { NextResponse, type NextRequest } from "next/server";

import {
  createEmbedAccessToken,
  embedAccessCookieName,
  verifyEmbedPassword,
} from "@/lib/embed-access";
import { normalizeNotionPageId, validUuid } from "@/lib/identifiers";
import { prisma } from "@/lib/prisma";
import {
  clearSecurityAttempts,
  consumeSecurityAttempt,
} from "@/lib/rate-limit";
import { appUrl } from "@/lib/site-config";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const redirectUrl = appUrl(`/embed/${encodeURIComponent(id)}`, request.url);

  if (!validUuid(id)) {
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const formData = await request.formData();
  const password = formData.get("password");
  const pageId = normalizeNotionPageId(formData.get("page"));
  if (pageId) redirectUrl.searchParams.set("page", pageId);
  const rateLimitScope = `embed-unlock:${id}`;
  const rateLimit = await consumeSecurityAttempt(request, rateLimitScope);

  if (rateLimit.limited) {
    redirectUrl.searchParams.set("access_error", "rate_limited");
    const response = NextResponse.redirect(redirectUrl, { status: 303 });
    response.headers.set("Retry-After", String(rateLimit.retryAfter));
    return response;
  }

  const embed = await prisma.embed.findFirst({
    where: { id, isActive: true },
    select: { passwordHash: true },
  });

  if (
    !embed?.passwordHash ||
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 72 ||
    !(await verifyEmbedPassword(password, embed.passwordHash))
  ) {
    redirectUrl.searchParams.set("access_error", "password");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  await clearSecurityAttempts(request, rateLimitScope);
  const accessToken = createEmbedAccessToken(id, embed.passwordHash);
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
