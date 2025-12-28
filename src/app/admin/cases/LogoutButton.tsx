"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <button
      onClick={logout}
      className="text-sm text-red-600 hover:underline"
    >
      Cerrar sesión
    </button>
  );
}
