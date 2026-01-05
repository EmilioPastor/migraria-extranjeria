import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("tramites")
    .select("id, label, key, description, active")
    .order("label", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Error cargando trámites" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}
