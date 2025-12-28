"use client";

import { useEffect, useState } from "react";

type AuditItem = {
  id: string;
  admin_email: string;
  action: string;
  target?: string;
  created_at: string;
};

export default function AuditPage() {
  const [items, setItems] = useState<AuditItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/audit", { credentials: "include" })
      .then((r) => r.json())
      .then(setItems);
  }, []);

  return (
    <section className="max-w-6xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-semibold mb-8">
        Auditoría de acciones
      </h1>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Fecha</th>
            <th className="p-4 text-left">Usuario</th>
            <th className="p-4 text-left">Acción</th>
            <th className="p-4 text-left">Objetivo</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4">
                {new Date(item.created_at).toLocaleString()}
              </td>
              <td className="p-4">{item.admin_email}</td>
              <td className="p-4">{item.action}</td>
              <td className="p-4">{item.target || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
