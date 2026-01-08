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
    <button className=" text-white-600 font-bold border border-white-600 py-2 px-4 rounded" onClick={logout}>
      Cerrar sesión
    </button>
  );
}
