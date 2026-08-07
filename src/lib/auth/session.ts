import { SignJWT, jwtVerify } from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET!;
const secretKey = new TextEncoder().encode(SESSION_SECRET);

export const SESSION_COOKIE_NAME = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
export type SessionPayload = {
  userId: string;
  username: string;
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (typeof payload.userId !== "string" || typeof payload.username !== "string") {
      return null;
    }
    return { userId: payload.userId, username: payload.username };
  } catch {
    return null;
  }
}