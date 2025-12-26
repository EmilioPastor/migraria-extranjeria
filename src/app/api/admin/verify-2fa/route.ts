import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { email, code } = await req.json();
  const supabase = supabaseAdmin();

  const { data: user } = await supabase
    .from("admin_users")
    .select("id, role, two_factor_code, two_factor_expires_at")
    .eq("email", email)
    .single();

  if (
    !user ||
    user.two_factor_code !== code ||
    new Date(user.two_factor_expires_at) < new Date()
  ) {
    return NextResponse.json(
      { error: "Código inválido o expirado" },
      { status: 401 }
    );
  }

  await supabase
    .from("admin_users")
    .update({
      two_factor_code: null,
      two_factor_expires_at: null,
    })
    .eq("id", user.id);

  cookies().set("admin-session", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true });
}
