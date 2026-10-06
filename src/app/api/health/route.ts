import { NextResponse } from "next/server";
import { cleanEnv, cleanSupabaseUrl } from "@/lib/env";
import { checkStorage } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Diagnostic page: reports whether the server's settings look right. It never prints a key or password,
// only lengths, yes/no answers and Supabase's own error text. Safe to delete once uploads work.
export async function GET() {
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const rawUrl = process.env.SUPABASE_URL || "";
  const key = cleanEnv("SUPABASE_SERVICE_ROLE_KEY") || "";
  const url = cleanSupabaseUrl() || "";

  let jwtRole: string | null = null;
  let jwtRef: string | null = null;
  try {
    const payload = JSON.parse(Buffer.from(key.split(".")[1] || "", "base64").toString("utf8"));
    jwtRole = payload.role ?? null;
    jwtRef = payload.ref ?? null;
  } catch { /* not a JWT-style key */ }
  const urlRef = url.replace(/^https?:\/\//, "").split(".")[0] || null;

  const storage = key && url ? await checkStorage() : { ok: false, error: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is empty" };

  let database: { ok: boolean; error?: string } = { ok: false };
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.$queryRaw`select 1`;
    database = { ok: true };
  } catch (e: any) {
    database = { ok: false, error: `${e?.code || e?.name || "error"}: ${String(e?.message || "").split("\n").pop()?.slice(0, 160)}` };
  }

  const dbUrl = process.env.DATABASE_URL || "";
  return NextResponse.json({
    supabaseUrl: { host: url.replace(/^https?:\/\//, ""), hadQuotesOrSpaces: rawUrl !== rawUrl.trim() || /["']/.test(rawUrl), hadPath: /\/(rest|storage)\/v1/i.test(rawUrl) },
    serviceKey: {
      length: key.length,
      hadQuotesOrSpaces: rawKey !== rawKey.trim() || /["'\s]/.test(rawKey),
      parts: key.split(".").length,
      startsWithEyJ: key.startsWith("eyJ"),
      role: jwtRole,
      projectRef: jwtRef,
      projectMatchesUrl: !!jwtRef && jwtRef === urlRef,
    },
    storage,
    database,
    databaseUrl: { port: (dbUrl.match(/:(\d{4,5})\//) || [])[1] || null, hasPgbouncerFlag: /pgbouncer=true/.test(dbUrl), hadQuotes: /["']/.test(dbUrl) },
  });
}
