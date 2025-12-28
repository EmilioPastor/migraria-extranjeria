import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("admin-session")?.value;

  // Proteger /admin (excepto login)
  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    !req.nextUrl.pathname.startsWith("/admin/login")
  ) {
    // No sesión → login
    if (!role) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    // Rutas solo admin
    if (
      (req.nextUrl.pathname.startsWith("/admin/users") ||
        req.nextUrl.pathname.startsWith("/admin/audit")) &&
      role !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/admin", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
