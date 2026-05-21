import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "murmur-dev-secret-change-in-production",
);

export type SessionPayload = {
  sub: string;
  orgId: string;
};

export type SetupPayload = {
  email: string;
  orgId: string;
  typ: "setup";
};

export async function signSession(userId: string, orgId: string): Promise<string> {
  return new SignJWT({ orgId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || typeof payload.orgId !== "string") return null;
    return { sub: payload.sub, orgId: payload.orgId };
  } catch {
    return null;
  }
}

/** Short-lived token after OTP — used only to set password on signup. */
export async function signSetupToken(email: string, orgId: string): Promise<string> {
  return new SignJWT({ orgId, email: email.toLowerCase(), typ: "setup" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifySetupToken(token: string): Promise<SetupPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      payload.typ !== "setup" ||
      typeof payload.email !== "string" ||
      typeof payload.orgId !== "string"
    ) {
      return null;
    }
    return {
      email: payload.email,
      orgId: payload.orgId,
      typ: "setup",
    };
  } catch {
    return null;
  }
}
