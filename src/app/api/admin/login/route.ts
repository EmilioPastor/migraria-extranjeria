import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import { generate2FACode, expiresIn } from "@/lib/twoFactor";
import { sendAdminEmail } from "@/lib/sendAdminEmail";

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

  const { data: user } = await supabase
    .from("admin_users")
    .select(
      "id, email, password_hash, role, active, two_factor_enabled"
    )
    .eq("email", email)
    .eq("active", true)
    .single();

  if (!user) {
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  }

  // 🔐 2FA ACTIVADO
  if (user.two_factor_enabled) {
    const code = generate2FACode();

    await supabase
      .from("admin_users")
      .update({
        two_factor_code: code,
        two_factor_expires_at: expiresIn(5),
      })
      .eq("id", user.id);

    await sendAdminEmail(
      user.email,
      "Código de acceso Migraria",
      `Tu código de acceso es: ${code}\nCaduca en 5 minutos.`
    );

    return NextResponse.json({
      twoFactorRequired: true,
      email: user.email,
    });
  }

  // ✅ LOGIN NORMAL
  cookies().set("admin-session", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true });
}
