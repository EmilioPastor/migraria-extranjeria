import { NextResponse } from "next/server";

export function middleware(req) {
  const role = req.cookies.get("admin-session")?.value;

  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    !req.nextUrl.pathname.startsWith("/admin/login")
  ) {
    if (!role) {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    // 🔒 Solo admin puede evaluar casos
    if (
      req.nextUrl.pathname.startsWith("/admin/case") &&
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
