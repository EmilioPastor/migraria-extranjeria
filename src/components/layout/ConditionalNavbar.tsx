// components/layout/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Importa tu Navbar actual

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Verificar si estamos en una ruta de admin
  const isAdminRoute = pathname?.startsWith("/admin");
  const isPortalRoute = pathname?.startsWith("/portal");
  
  // Si estamos en admin, no mostrar navbar
  if (isAdminRoute || isPortalRoute) {
    return null;
  }
  
  // Si no estamos en admin, mostrar el navbar normal
  return <Navbar />;
}