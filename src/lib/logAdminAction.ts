import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function logAdminAction(
  adminEmail: string,
  action: string,
  target?: string,
  meta?: Record<string, any>
) {
  const supabase = supabaseAdmin();

  await supabase.from("admin_actions").insert({
    admin_email: adminEmail,
    action,
    target,
    meta,
  });
}
