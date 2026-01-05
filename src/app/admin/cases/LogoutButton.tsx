"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <button className="text-red-600" onClick={logout}>
      Cerrar sesión
    </button>
  );
}
