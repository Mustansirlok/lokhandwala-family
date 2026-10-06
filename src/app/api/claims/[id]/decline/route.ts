import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deletePhoto } from "@/lib/storage";

// Protected by middleware.ts (admin cookie required)
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const claim = await prisma.claim.findUnique({ where: { id: params.id } });
  if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });

  const photoUrls = (claim.photoUrls as any as string[]) || [];
  await Promise.all(photoUrls.map((url) => deletePhoto(url).catch(() => {})));
  await prisma.claim.update({ where: { id: claim.id }, data: { status: "DECLINED" } });

  return NextResponse.json({ ok: true });
}
