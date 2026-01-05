import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Verifica que el usuario logueado:
 * - existe en admin_users
 * - está activo
 * - devuelve su rol
 */
export async function requireAdmin(userId: string) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("admin_users")
    .select("role, active")
    .eq("user_id", userId)
    .single();

  if (error || !data || !data.active) {
    redirect("/admin/login");
  }

  return data; // { role, active }
}
    