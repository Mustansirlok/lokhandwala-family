import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Claim } from "@prisma/client";
import type { ClaimDTO } from "@/lib/avatarOptions";

export const dynamic = "force-dynamic";

// GET is protected by middleware.ts (admin cookie required for /api/claims GET)
export async function GET() {
  const rows = await prisma.claim.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  const claims: ClaimDTO[] = rows.map((c: Claim) => ({
    id: c.id,
    name: c.name,
    email: c.email || "",
    phoneCountryCode: c.phoneCountryCode || "",
    phoneNumber: c.phoneNumber || "",
    birthYear: c.birthYear ? String(c.birthYear) : "",
    height: c.height || "",
    bloodGroup: c.bloodGroup || "",
    bio: c.bio || "",
    avatar: c.avatar as any,
    photoUrls: (c.photoUrls as any) || [],
    parent1Id: c.parent1Id,
    parent2Id: c.parent2Id,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  }));

  return NextResponse.json({ claims });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.name || !body.avatar) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const claim = await prisma.claim.create({
    data: {
      name: body.name,
      email: body.email || null,
      phoneCountryCode: body.phoneCountryCode || null,
      phoneNumber: body.phoneNumber || null,
      birthYear: body.birthYear ? parseInt(body.birthYear, 10) || null : null,
      height: body.height || null,
      bloodGroup: body.bloodGroup || null,
      bio: body.bio || null,
      avatar: body.avatar,
      photoUrls: [],
      parent1Id: body.parent1Id || null,
      parent2Id: body.parent2Id || null,
    },
  });

  return NextResponse.json({ id: claim.id });
}
