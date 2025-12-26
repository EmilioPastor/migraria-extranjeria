import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  const hash = bcrypt.hashSync(password, 10);
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("admin_users").insert({
    email,
    password_hash: hash,
    role,
    active: true,
  });

  if (error) {
    return NextResponse.json({ error: "Error creando usuario" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
