import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/subscription";

export async function PATCH(request: Request) {
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

  if (
    !body ||
    typeof body !== "object" ||
    !("plan" in body) ||
    (body.plan !== "Free" && body.plan !== "Pro")
  ) {
    return NextResponse.json({ message: "Choose a valid plan." }, { status: 400 });
  }

  const billingInterval =
    "billingInterval" in body && body.billingInterval === "yearly"
      ? "YEARLY"
      : "MONTHLY";
  const existing = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  if (existing && existing.provider !== "demo") {
    if (hasProAccess(existing)) {
      return NextResponse.json({ plan: "Pro" as const });
    }
    return NextResponse.json(
      { message: "This subscription is managed by its billing provider." },
      { status: 409 },
    );
  }

  if (body.plan === "Free") {
    const embedCount = await prisma.embed.count({ where: { userId: user.id } });
    if (embedCount > 1) {
      return NextResponse.json(
        { message: "Keep one embed before switching to the Free demo." },
        { status: 409 },
      );
    }
    if (existing) {
      await prisma.subscription.delete({ where: { userId: user.id } });
    }
    return NextResponse.json({ plan: "Free" as const });
  }

  const periodStart = new Date();
  const periodEnd = new Date(periodStart);
  if (billingInterval === "YEARLY") {
    periodEnd.setUTCFullYear(periodEnd.getUTCFullYear() + 1);
  } else {
    periodEnd.setUTCMonth(periodEnd.getUTCMonth() + 1);
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      id: randomUUID(),
      userId: user.id,
      plan: "PRO",
      billingInterval,
      status: "ACTIVE",
      provider: "demo",
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
    update: {
      plan: "PRO",
      billingInterval,
      status: "ACTIVE",
      provider: "demo",
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
    },
  });

  return NextResponse.json({ plan: "Pro" as const });
}
