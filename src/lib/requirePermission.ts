import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PERMISSIONS } from "./permissions";

export async function requirePermission(
  userId: string,
  permission: keyof (typeof PERMISSIONS)["admin"]
) {
  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("admin_users")
    .select("role, active")
    .eq("user_id", userId)
    .single();

  if (!data || !data.active) {
    redirect("/admin/login");
  }

  const role = data.role as keyof typeof PERMISSIONS;

  if (!PERMISSIONS[role]?.[permission]) {
    redirect("/admin/dashboard");
  }

  return data;
}
