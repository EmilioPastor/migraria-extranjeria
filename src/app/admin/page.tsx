"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdminHomePage() {
  const router = useRouter();

  const logout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <section className="max-w-4xl mx-auto py-20 px-6 space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          Panel interno – Migraria
        </h1>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="text-gray-600">
        Acceso interno para gestión de evaluaciones.
      </p>

      {/* ACCESOS */}
      <div className="space-y-4">
        <Link
          href="/admin/cases"
          className="block border p-4 rounded hover:bg-gray-50 transition"
        >
          Ver casos en evaluación →
        </Link>
      </div>
    </section>
  );
}
