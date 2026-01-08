import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function requireAdminApi(req: Request) {
  const supabase = supabaseAdmin();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return { error: "Missing Authorization header", status: 401 };
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: "Invalid session", status: 401 };
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("role, active")
    .eq("user_id", user.id)
    .single();

  if (!admin || !admin.active) {
    return { error: "Forbidden", status: 403 };
  }

  return { user, admin };
}
