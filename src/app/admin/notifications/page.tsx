import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminNotificationsPage() {
  const supabase = supabaseAdmin();

  const { data: notifications } = await supabase
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <section className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-2xl font-semibold mb-6">
        Notificaciones
      </h1>

      <div className="space-y-4">
        {notifications?.map((n) => (
          <div
            key={n.id}
            className={`border p-4 rounded ${
              n.read
                ? "bg-gray-50"
                : "bg-yellow-50 border-yellow-300"
            }`}
          >
            <h2 className="font-medium">{n.title}</h2>
            <p className="text-sm text-gray-700">
              {n.message}
            </p>

            <a
              href={`/admin/case/${n.case_id}`}
              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
            >
              Revisar caso →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
