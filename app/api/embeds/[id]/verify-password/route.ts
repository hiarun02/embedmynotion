import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { verifyEmbedPassword } from "@/lib/embed-access";
import { validUuid } from "@/lib/identifiers";
import { prisma } from "@/lib/prisma";
import {
  clearSecurityAttempts,
  consumeSecurityAttempt,
} from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { message: "Please sign in again." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!validUuid(id)) {
    return NextResponse.json({ message: "Embed not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? (body as { password?: unknown }).password
      : null;

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 72
  ) {
    return NextResponse.json(
      { message: "Enter a password between 6 and 72 characters." },
      { status: 400 },
    );
  }

  const rateLimitScope = `password-check:${user.id}:${id}`;
  const rateLimit = await consumeSecurityAttempt(request, rateLimitScope);
  if (rateLimit.limited) {
    return NextResponse.json(
      { message: "Too many attempts. Try again in 15 minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  const embed = await prisma.embed.findFirst({
    where: { id, userId: user.id },
    select: { passwordHash: true },
  });

  if (
    !embed?.passwordHash ||
    !(await verifyEmbedPassword(password, embed.passwordHash))
  ) {
    return NextResponse.json(
      { message: "That password is not correct." },
      { status: 401 },
    );
  }

  await clearSecurityAttempts(request, rateLimitScope);
  return NextResponse.json({ unlocked: true });
}
