import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminIdentity } from "../../types/admin";

export const adminSessionCookieName = "switch_north_admin_session";

const sessionMaxAgeSeconds = 60 * 60 * 8;

type AdminSessionPayload = AdminIdentity & {
  exp: number;
};

export class AdminAuthorizationError extends Error {
  constructor(message = "Admin authorization is required.") {
    super(message);
    this.name = "AdminAuthorizationError";
  }
}

function getDefaultDevelopmentSecret() {
  return "switch-north-development-admin-session-secret";
}

function getAdminConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const username = process.env.ADMIN_USERNAME ?? (isProduction ? "" : "admin");
  const password =
    process.env.ADMIN_PASSWORD ?? (isProduction ? "" : "change-this-admin-password");
  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET ??
    (isProduction ? "" : getDefaultDevelopmentSecret());

  return {
    password,
    sessionSecret,
    username,
  };
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function verifyAdminCredentials(
  username: string,
  password: string,
): AdminIdentity | null {
  const config = getAdminConfig();

  if (!config.username || !config.password) {
    return null;
  }

  if (
    !constantTimeEqual(username, config.username) ||
    !constantTimeEqual(password, config.password)
  ) {
    return null;
  }

  return {
    id: `admin:${config.username}`,
    username: config.username,
  };
}

export function createAdminSessionToken(
  identity: AdminIdentity,
  now = new Date(),
) {
  const config = getAdminConfig();

  if (!config.sessionSecret) {
    throw new Error("ADMIN_SESSION_SECRET is required for admin sessions.");
  }

  const payload: AdminSessionPayload = {
    ...identity,
    exp: now.getTime() + sessionMaxAgeSeconds * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");

  return `${encodedPayload}.${sign(encodedPayload, config.sessionSecret)}`;
}

export function verifyAdminSessionToken(
  token: string | undefined,
  now = new Date(),
): AdminIdentity | null {
  if (!token) {
    return null;
  }

  const config = getAdminConfig();
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature || !config.sessionSecret) {
    return null;
  }

  if (!constantTimeEqual(signature, sign(encodedPayload, config.sessionSecret))) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as AdminSessionPayload;

    if (!payload.id || !payload.username || payload.exp <= now.getTime()) {
      return null;
    }

    return {
      id: payload.id,
      username: payload.username,
    };
  } catch {
    return null;
  }
}

export async function setAdminSession(identity: AdminIdentity) {
  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookieName, createAdminSessionToken(identity), {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/admin",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(adminSessionCookieName);
}

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;

  return verifyAdminSessionToken(token);
}

export function assertAdmin(identity: AdminIdentity | null): AdminIdentity {
  if (!identity) {
    throw new AdminAuthorizationError();
  }

  return identity;
}

export async function requireAdmin() {
  const identity = await getCurrentAdmin();

  if (!identity) {
    redirect("/admin/login");
  }

  return identity;
}
