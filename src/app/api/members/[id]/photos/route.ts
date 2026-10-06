import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadPhoto } from "@/lib/storage";
import { MAX_PHOTOS } from "@/lib/avatarOptions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const member = await prisma.familyMember.findUnique({
      where: { id: params.id },
      include: { photos: true },
    });
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    if (member.photos.length >= MAX_PHOTOS) {
      return NextResponse.json({ error: `This member already has the maximum of ${MAX_PHOTOS} photos` }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });

    const url = await uploadPhoto(member.id, file);
    const photo = await prisma.photo.create({ data: { memberId: member.id, url } });
    return NextResponse.json({ photo: { id: photo.id, url: photo.url } });
  } catch (e: any) {
    console.error("[photo upload] failed:", e);
    const msg = String(e?.message || "");
    if (msg.startsWith("Storage upload failed")) {
      return NextResponse.json({ error: msg }, { status: 500 });
    }
    return NextResponse.json(
      { error: `Upload failed (${e?.code || e?.name || "unknown"}) — see the server log` },
      { status: 500 }
    );
  }
}
