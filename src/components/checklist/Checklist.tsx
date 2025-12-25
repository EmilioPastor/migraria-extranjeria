"use client";

import { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type ChecklistData = {
  title: string;
  intro: string;
  requisitos: string[];
  documentos: string[];
  plazo: string;
  errores: string[];
};

type ChecklistProps = {
  data: ChecklistData;
  tipoCita: string; // 👈 CLAVE
};

export default function Checklist({ data, tipoCita }: ChecklistProps) {
  const storageKey = `checklist-${data.title
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  /* CARGAR */
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setChecked(JSON.parse(saved));
  }, [storageKey]);

  /* GUARDAR */
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  const toggle = (item: string) => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  /* PROGRESO */
  const totalDocs = data.documentos.length;
  const checkedCount = useMemo(
    () => data.documentos.filter((doc) => checked[doc]).length,
    [checked, data.documentos]
  );

  const progress = Math.round((checkedCount / totalDocs) * 100);

  /* RESUMEN */
  const selectedDocs = data.documentos.filter((doc) => checked[doc]);

  const checklistSummary = encodeURIComponent(
    `Trámite: ${data.title}

Documentos preparados (${selectedDocs.length}/${data.documentos.length}):
${selectedDocs.map((d) => `- ${d}`).join("\n")}`
  );

  return (
    <section className="bg-white section">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-[var(--primary)] mb-4">
          {data.title}
        </h2>

        <p className="mb-12 text-[var(--text-muted)]">{data.intro}</p>

        {/* PROGRESO */}
        <div className="mb-16">
          <p className="mb-2 text-sm text-[var(--text-muted)]">
            Progreso de preparación: {checkedCount} de {totalDocs} documentos
          </p>

          <div className="w-full h-3 bg-gray-200 rounded-sm overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card title="Requisitos principales">
          <ul className="space-y-3">
            {data.requisitos.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </Card>

        <div className="mt-12">
          <Card title="Documentación necesaria">
            <ul className="space-y-4">
              {data.documentos.map((doc) => (
                <li key={doc} className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={checked[doc] || false}
                    onChange={() => toggle(doc)}
                  />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-12">
          <Card title="Plazo orientativo">{data.plazo}</Card>
        </div>

        <div className="mt-12">
          <Card title="Errores frecuentes">
            <ul className="space-y-3">
              {data.errores.map((e) => (
                <li key={e}>⚠️ {e}</li>
              ))}
            </ul>
          </Card>
        </div>

        {/* CTA CORRECTA */}
        <div className="mt-20 text-center">
          <Button
            href={`/pedir-cita?tipo=${tipoCita}&checklist=${checklistSummary}`}
          >
            Pedir cita y enviar mi checklist
          </Button>
        </div>
      </div>
    </section>
  );
}
