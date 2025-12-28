import { supabaseAdmin } from "@/lib/supabaseAdmin";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export async function logAdminAction(
  adminEmail: string,
  action: string,
  target?: string,
  meta?: Record<string, JsonValue>
) {
  const supabase = supabaseAdmin();

  await supabase.from("admin_actions").insert({
    admin_email: adminEmail,
    action,
    target,
    meta,
  });
}
