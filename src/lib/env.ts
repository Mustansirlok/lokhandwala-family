/**
 * Reads an environment variable and cleans the mistakes that are easy to make when pasting
 * into a hosting dashboard: surrounding quotes, spaces and line breaks.
 */
export function cleanEnv(name: string): string | undefined {
  const raw = process.env[name];
  if (!raw) return undefined;
  let v = raw.trim();
  v = v.replace(/^["']+|["']+$/g, "").trim();
  v = v.replace(/\s+/g, ""); // a key or URL never contains whitespace
  return v || undefined;
}

/** Base project URL only: no trailing slash and no /rest/v1 or /storage/v1 path. */
export function cleanSupabaseUrl(): string | undefined {
  const u = cleanEnv("SUPABASE_URL");
  if (!u) return undefined;
  return u.replace(/\/(rest|storage|auth)\/v1.*$/i, "").replace(/\/+$/, "");
}
