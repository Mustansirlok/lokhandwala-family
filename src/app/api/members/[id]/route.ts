import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BLOOD_GROUPS } from "@/lib/avatarOptions";

export const dynamic = "force-dynamic";

type Cleaned = {
  birthYear?: number | null;
  email?: string | null;
  height?: string | null;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  bloodGroup?: string | null;
  bio?: string | null;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Validates only the fields that were sent. Returns an error message or the cleaned values. */
function clean(body: any): { error: string } | { data: Cleaned } {
  const data: Cleaned = {};

  if ("birthYear" in body) {
    const raw = str(body.birthYear);
    if (raw === "") data.birthYear = null;
    else {
      const y = Number(raw);
      if (!/^\d{4}$/.test(raw) || y < 1900 || y > new Date().getFullYear()) {
        return { error: "Birth year must be a 4-digit year, e.g. 1985." };
      }
      data.birthYear = y;
    }
  }
  if ("email" in body) {
    const v = str(body.email);
    if (v && (v.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) return { error: "That email address doesn't look right." };
    data.email = v || null;
  }
  if ("height" in body) {
    const v = str(body.height);
    if (v.length > 20) return { error: "Height is too long." };
    data.height = v || null;
  }
  if ("phoneCountryCode" in body) {
    const v = str(body.phoneCountryCode);
    if (v && !/^\+\d{1,4}$/.test(v)) return { error: "Invalid country code." };
    data.phoneCountryCode = v || null;
  }
  if ("phoneNumber" in body) {
    const v = str(body.phoneNumber);
    if (v && !/^[\d\s\-().]{4,20}$/.test(v)) return { error: "Phone number can only contain digits, spaces and - ( ) ." };
    data.phoneNumber = v || null;
  }
  if ("bloodGroup" in body) {
    const v = str(body.bloodGroup);
    if (v && !BLOOD_GROUPS.includes(v)) return { error: "Invalid blood group." };
    data.bloodGroup = v || null;
  }
  if ("bio" in body) {
    const v = str(body.bio);
    if (v.length > 600) return { error: "The anecdote is limited to 600 characters." };
    data.bio = v || null;
  }

  if (Object.keys(data).length === 0) return { error: "Nothing to update." };
  return { data };
}

// Edits a member's own details (not their name or place in the tree).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const result = clean(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  try {
    const m = await prisma.familyMember.update({ where: { id: params.id }, data: result.data });
    return NextResponse.json({
      member: {
        vitals: {
          birthYear: m.birthYear ? String(m.birthYear) : "",
          email: m.email || "",
          height: m.height || "",
          phoneCountryCode: m.phoneCountryCode || "",
          phoneNumber: m.phoneNumber || "",
          bloodGroup: m.bloodGroup || "",
        },
        bio: m.bio || "",
      },
    });
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "Member not found" }, { status: 404 });
    console.error("[member details] failed:", e);
    return NextResponse.json({ error: `Couldn't save (${e?.code || e?.name || "error"}) — please try again.` }, { status: 500 });
  }
}
