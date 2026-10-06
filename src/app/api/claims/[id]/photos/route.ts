import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadPhoto } from "@/lib/storage";
import { MAX_PHOTOS } from "@/lib/avatarOptions";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const claim = await prisma.claim.findUnique({ where: { id: params.id } });
  if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });

  const existing = (claim.photoUrls as any as string[]) || [];
  if (existing.length >= MAX_PHOTOS) {
    return NextResponse.json({ error: `Maximum of ${MAX_PHOTOS} photos reached` }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });

  try {
    const url = await uploadPhoto(claim.id, file);
    const updated = await prisma.claim.update({
      where: { id: claim.id },
      data: { photoUrls: [...existing, url] },
    });
    return NextResponse.json({ photoUrls: updated.photoUrls });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
