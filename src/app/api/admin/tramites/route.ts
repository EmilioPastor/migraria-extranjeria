import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("tramites")
    .select("id, label, key, description, active")
    .eq("active", true)
    .order("label");

  if (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
