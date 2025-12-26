import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { id, role, active } = await req.json();
  const supabase = supabaseAdmin();

  const { error } = await supabase
    .from("admin_users")
    .update({ role, active })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error actualizando usuario" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
