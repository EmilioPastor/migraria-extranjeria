import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .single();

  return NextResponse.json(data);
}
