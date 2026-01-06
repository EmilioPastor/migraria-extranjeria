// middleware.ts - versión con debug
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  console.log('🔍 Middleware triggered for:', pathname);
  console.log('🕐 Time:', new Date().toISOString());

  // 🔓 Login público
  if (pathname === "/admin/login") {
    console.log('✅ Public route, allowing access');
    return NextResponse.next();
  }

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = req.cookies.get(name)?.value;
          console.log(`🍪 Cookie ${name}:`, cookie ? 'Present' : 'Missing');
          return cookie;
        },
        set(name: string, value: string, options) {
          console.log(`🍪 Setting cookie ${name}`);
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          console.log(`🍪 Removing cookie ${name}`);
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  console.log('👤 Session exists?', !!session);
  console.log('❌ Error?', error);
  console.log('🔑 User ID:', session?.user?.id);

  if (pathname.startsWith("/admin") && !session) {
    console.log('🚫 No session, redirecting to login');
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  console.log('✅ Access granted to', pathname);
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};