import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.avatar !== "object") {
    return NextResponse.json({ error: "Missing avatar payload" }, { status: 400 });
  }

  try {
    const updated = await prisma.familyMember.update({
      where: { id: params.id },
      data: { avatar: body.avatar },
    });
    return NextResponse.json({ ok: true, avatar: updated.avatar });
  } catch (e) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
}
