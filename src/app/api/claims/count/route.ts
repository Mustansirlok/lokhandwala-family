import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Intentionally public — exposes only a count, no claim details.
export async function GET() {
  try {
    const count = await prisma.claim.count({ where: { status: "PENDING" } });
    return NextResponse.json({ count });
  } catch (e) {
    console.error("[/api/claims/count] failed:", e);
    return NextResponse.json({ count: 0 });
  }
}
