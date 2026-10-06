import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ALLOWED_FIELDS = ["avatar", "bio", "birthYear", "height", "bloodGroup", "name", "email", "phoneCountryCode", "phoneNumber", "parent1Id", "parent2Id"] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const data: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) data[key] = key === "birthYear" ? (body[key] ? parseInt(body[key], 10) || null : null) : body[key];
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
  }

  try {
    const updated = await prisma.claim.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }
}
