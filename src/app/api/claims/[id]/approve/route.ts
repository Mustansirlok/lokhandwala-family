import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { FamilyMember, Prisma } from "@prisma/client";

// Protected by middleware.ts (admin cookie required)
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const claim = await prisma.claim.findUnique({ where: { id: params.id } });
  if (!claim || claim.status !== "PENDING") {
    return NextResponse.json({ error: "Claim not found or already resolved" }, { status: 404 });
  }

  const parents = await prisma.familyMember.findMany({
    where: { id: { in: [claim.parent1Id, claim.parent2Id].filter(Boolean) as string[] } },
  });
  const gen = parents.length ? Math.max(...parents.map((p: FamilyMember) => p.gen)) + 1 : 1;
  const relation = parents.length ? `Child of ${parents.map((p: FamilyMember) => p.name).join(" & ")}` : "New member";
  const siblingCount = await prisma.familyMember.count({ where: { gen } });

  const photoUrls = (claim.photoUrls as any as string[]) || [];

  const member = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const created = await tx.familyMember.create({
      data: {
        name: claim.name,
        gen,
        order: siblingCount,
        parent1Id: claim.parent1Id,
        parent2Id: claim.parent2Id,
        spouseId: null,
        relation,
        birthYear: claim.birthYear,
        email: claim.email,
        height: claim.height,
        phoneCountryCode: claim.phoneCountryCode,
        phoneNumber: claim.phoneNumber,
        bloodGroup: claim.bloodGroup,
        bio: claim.bio,
        avatar: claim.avatar as any,
        photos: { create: photoUrls.map((url) => ({ url })) },
      },
    });
    await tx.claim.update({ where: { id: claim.id }, data: { status: "APPROVED" } });
    return created;
  });

  return NextResponse.json({ id: member.id });
}
