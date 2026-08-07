import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "smartdrobe_token";

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Add base64 padding if required
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes and /api/admin API endpoints
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login?error=admin_required", request.url));
    }

    const payload = decodeJwtPayload(token);

    if (!payload || !payload.role) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login?error=invalid_session", request.url));
    }

    if (payload.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Admin role required" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard?error=access_denied", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
