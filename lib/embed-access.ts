import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function hashEmbedPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyEmbedPassword(password: string, stored: string) {
  const [algorithm, salt, expectedHex] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;

  const expected = Buffer.from(expectedHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createEmbedAccessToken(embedId: string, passwordHash: string) {
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
  const signature = createHmac("sha256", passwordHash)
    .update(`${embedId}:${expiresAt}`)
    .digest("base64url");
  return `${expiresAt}.${signature}`;
}

export function verifyEmbedAccessToken(
  token: string | undefined,
  embedId: string,
  passwordHash: string,
) {
  if (!token) return false;
  const [expiresText, suppliedSignature] = token.split(".");
  const expiresAt = Number(expiresText);
  if (!expiresAt || expiresAt < Date.now() || !suppliedSignature) return false;

  const expectedSignature = createHmac("sha256", passwordHash)
    .update(`${embedId}:${expiresAt}`)
    .digest("base64url");
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function embedAccessCookieName(embedId: string) {
  return `embed-access-${embedId}`;
}
