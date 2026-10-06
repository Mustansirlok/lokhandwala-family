import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedAdminCookieValue } from "@/lib/adminAuth";

export const config = {
  matcher: ["/admin", "/api/claims", "/api/claims/:id*/approve", "/api/claims/:id*/decline"],
};

export async function middleware(req: NextRequest) {
  // Submitting a new claim (POST /api/claims) must stay public — only
  // reading the queue (GET) and approve/decline are admin-only.
  if (req.nextUrl.pathname === "/api/claims" && req.method === "POST") {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await expectedAdminCookieValue();

  if (cookie && cookie === expected) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}
