import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Inténtalo más tarde." },
      { status: 429 }
    );
  }

  const { email, password } = await req.json();

  const supabase = supabaseAdmin();

  const { data: user, error } = await supabase
    .from("admin_users")
    .select("email, password_hash, role, active")
    .eq("email", email)
    .eq("active", true)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  }

  const validPassword = bcrypt.compareSync(
    password,
    user.password_hash
  );

  if (!validPassword) {
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  }

  cookies().set("admin-session", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  console.log("[ADMIN LOGIN]", {
    email: user.email,
    role: user.role,
    ip,
    userAgent: req.headers.get("user-agent"),
    date: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, role: user.role });
}
