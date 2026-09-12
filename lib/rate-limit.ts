import { createHash } from "node:crypto";
import { headers } from "next/headers";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  identifier: string;
  limit: number;
  scope: string;
  windowMs: number;
};

const buckets = new Map<string, RateLimitRecord>();

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function cleanup(now: number) {
  for (const [key, record] of buckets.entries()) {
    if (record.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export async function getRequestIdentifier(fallback: string) {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headerStore.get("x-real-ip");
  const userAgent = headerStore.get("user-agent") ?? "unknown-agent";
  const ip = forwardedFor || realIp || "unknown-ip";

  return hashIdentifier(`${ip}:${userAgent}:${fallback.toLowerCase()}`);
}

export function checkRateLimit({
  identifier,
  limit,
  scope,
  windowMs,
}: RateLimitOptions) {
  const now = Date.now();
  const key = `${scope}:${identifier}`;
  const existing = buckets.get(key);

  cleanup(now);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return { allowed: true, retryAfterSeconds: 0 };
}
