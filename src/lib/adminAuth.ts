export const ADMIN_COOKIE = "admin_session";

/**
 * A small family app doesn't need full user accounts for the admin
 * queue — a single shared password gate is enough. The cookie holds a
 * SHA-256 hash of the password (not the password itself), computed with
 * Web Crypto so this works identically in Node API routes and in Edge
 * middleware.
 */
export async function hashAdminPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedAdminCookieValue(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD || "";
  return hashAdminPassword(password);
}
