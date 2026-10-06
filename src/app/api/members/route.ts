import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { FamilyMember, Photo } from "@prisma/client";
import type { FamilyMemberDTO } from "@/lib/avatarOptions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
  const rows = await prisma.familyMember.findMany({
    include: { photos: { orderBy: { createdAt: "asc" } } },
    orderBy: [{ gen: "asc" }, { order: "asc" }],
  });

  const members: FamilyMemberDTO[] = rows.map((m: FamilyMember & { photos: Photo[] }) => ({
    id: m.id,
    name: m.name,
    gen: m.gen,
    order: m.order,
    parent1Id: m.parent1Id,
    parent2Id: m.parent2Id,
    spouseId: m.spouseId,
    relation: m.relation,
    deceased: m.deceased,
    vitals: {
      birthYear: m.birthYear ? String(m.birthYear) : "",
      email: m.email || "",
      height: m.height || "",
      phoneCountryCode: m.phoneCountryCode || "",
      phoneNumber: m.phoneNumber || "",
      bloodGroup: m.bloodGroup || "",
    },
    bio: m.bio || "",
    avatar: m.avatar as any,
    photos: m.photos.map((p: Photo) => ({ id: p.id, url: p.url })),
  }));

  return NextResponse.json({ members }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    console.error("[/api/members] failed:", e);
    return NextResponse.json(
      { error: `Database error (${e?.code || e?.name || "unknown"}) — see the server log` },
      { status: 500 }
    );
  }
}
