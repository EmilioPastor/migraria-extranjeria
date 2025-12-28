import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, role, active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Error cargando usuarios" }, { status: 500 });
  }

  return NextResponse.json(data);
}
