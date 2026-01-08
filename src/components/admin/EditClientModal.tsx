"use client";

import { useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    caseId: string;
    initialEmail: string;
    initialTramite: string;
    initialTramiteKey: string;
    onUpdated: (data: { email: string; tramite: string }) => void;
};

export default function EditClientModal({
    open,
    onClose,
    caseId,
    initialEmail,
    initialTramite,
    initialTramiteKey,
    onUpdated,
}: Props) {
    const [email, setEmail] = useState(initialEmail);
    const [tramite, setTramite] = useState(initialTramite);
    const [tramiteKey, setTramiteKey] = useState(initialTramiteKey);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const save = async () => {
        try {
            setSaving(true);
            setError(null);

            const res = await fetch("/api/admin/client/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    caseId,
                    email,
                    tramite,
                    tramite_key: tramiteKey,
                    adminEmail: "admin@migraria.es",
                }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json?.error);

            onUpdated({ email, tramite });
            onClose();
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Error al guardar");
            }
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
                <h2 className="text-xl font-bold mb-4">Editar cliente</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                            className="w-full mt-1 border rounded-lg p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Trámite</label>
                        <input
                            className="w-full mt-1 border rounded-lg p-2"
                            value={tramite}
                            onChange={(e) => setTramite(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Trámite key (interno)
                        </label>
                        <input
                            className="w-full mt-1 border rounded-lg p-2"
                            value={tramiteKey}
                            onChange={(e) => setTramiteKey(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={save}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                    >
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}
