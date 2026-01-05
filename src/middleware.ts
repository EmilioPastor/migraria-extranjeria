import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔓 Login público
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (pathname.startsWith("/admin") && !session) {
    return NextResponse.redirect(
      new URL("/admin/login", req.url)
    );
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
