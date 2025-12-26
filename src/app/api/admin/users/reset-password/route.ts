import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { id, newPassword } = await req.json();
  const supabase = supabaseAdmin();

  const hash = bcrypt.hashSync(newPassword, 10);

  const { error } = await supabase
    .from("admin_users")
    .update({ password_hash: hash })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error reseteando contraseña" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
