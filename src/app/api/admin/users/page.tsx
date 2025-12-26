"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  role: string;
  active: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const load = () =>
    fetch("/api/admin/users", { credentials: "include" })
      .then((r) => r.json())
      .then(setUsers);

  useEffect(() => {
    load();
  }, []);

  const updateUser = async (id: string, role: string, active: boolean) => {
    await fetch("/api/admin/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, role, active }),
    });
    load();
  };

  return (
    <section className="max-w-6xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-semibold mb-8">Usuarios internos</h1>

      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Rol</th>
            <th className="p-4 text-left">Activo</th>
            <th className="p-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-4">{u.email}</td>
              <td className="p-4">
                <select
                  value={u.role}
                  onChange={(e) =>
                    updateUser(u.id, e.target.value, u.active)
                  }
                >
                  <option value="admin">admin</option>
                  <option value="assistant">assistant</option>
                  <option value="read">read</option>
                </select>
              </td>
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={u.active}
                  onChange={(e) =>
                    updateUser(u.id, u.role, e.target.checked)
                  }
                />
              </td>
              <td className="p-4 text-sm text-gray-500">
                (reset pass vía endpoint)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
