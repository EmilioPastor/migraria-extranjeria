import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer(); // ✅ instancia correcta

  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip");

  const userAgent = req.headers.get("user-agent");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { error } = await supabase
    .from("admin_access_logs")
    .insert({
      user_id: user.id,
      email: user.email,
      ip,
      user_agent: userAgent,
    });

  if (error) {
    return NextResponse.json(
      { error: "Error saving log" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
