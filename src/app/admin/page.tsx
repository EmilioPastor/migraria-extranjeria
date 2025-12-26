"use client";

import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/admin-session=([^;]+)/);
    if (match) setRole(match[1]);
  }, []);

  return (
    <section className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-semibold mb-6">
        Panel interno – Migraria
      </h1>

      {role === "admin" && (
        <p className="text-green-700 mb-4">
          Rol: Administrador
        </p>
      )}

      {role === "assistant" && (
        <p className="text-blue-700 mb-4">
          Rol: Asistente
        </p>
      )}

      {role === "read" && (
        <p className="text-gray-600 mb-4">
          Rol: Solo lectura
        </p>
      )}
    </section>
  );
}
