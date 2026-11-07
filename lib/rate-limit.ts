import "server-only";

import { createHash } from "node:crypto";

import { prisma } from "@/lib/prisma";

const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_ATTEMPTS = 5;

function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function rateLimitKey(request: Request, scope: string) {
  return createHash("sha256")
    .update(`${scope}\0${clientAddress(request)}`)
    .digest("hex");
}

export async function consumeSecurityAttempt(request: Request, scope: string) {
  const key = rateLimitKey(request, scope);

  await prisma.$executeRaw`
    delete from public.security_rate_limits
    where updated_at < current_timestamp - interval '1 day'
  `;

  const [result] = await prisma.$queryRaw<
    Array<{ attempts: number; blockedUntil: Date | null }>
  >`
    insert into public.security_rate_limits (
      key,
      attempts,
      window_start,
      blocked_until,
      updated_at
    )
    values (${key}, 1, current_timestamp, null, current_timestamp)
    on conflict (key) do update set
      attempts = case
        when security_rate_limits.window_start <= current_timestamp - interval '15 minutes'
          then 1
        else security_rate_limits.attempts + 1
      end,
      window_start = case
        when security_rate_limits.window_start <= current_timestamp - interval '15 minutes'
          then current_timestamp
        else security_rate_limits.window_start
      end,
      blocked_until = case
        when security_rate_limits.blocked_until > current_timestamp
          then security_rate_limits.blocked_until
        when security_rate_limits.window_start <= current_timestamp - interval '15 minutes'
          then null
        when security_rate_limits.attempts + 1 > ${RATE_LIMIT_ATTEMPTS}
          then current_timestamp + interval '15 minutes'
        else null
      end,
      updated_at = current_timestamp
    returning attempts, blocked_until as "blockedUntil"
  `;

  const retryAfter = result?.blockedUntil
    ? Math.max(1, Math.ceil((result.blockedUntil.getTime() - Date.now()) / 1000))
    : RATE_LIMIT_WINDOW_MINUTES * 60;

  return {
    limited: Boolean(result?.blockedUntil && result.blockedUntil.getTime() > Date.now()),
    retryAfter,
  };
}

export async function clearSecurityAttempts(request: Request, scope: string) {
  const key = rateLimitKey(request, scope);
  await prisma.$executeRaw`
    delete from public.security_rate_limits where key = ${key}
  `;
}
