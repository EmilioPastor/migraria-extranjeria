"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProcessSteps from "@/components/ui/ProcessSteps";
import Button from "@/components/ui/Button";

interface ChecklistProps {
  title: string;
  intro: string;
  items: string[];
}

export default function Checklist({
  title,
  intro,
  items,
}: ChecklistProps) {
  const router = useRouter();

  const storageKey = `checklist-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setChecked(JSON.parse(saved));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  const toggle = (item: string) => {
    setChecked((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleContinue = () => {
    const params = new URLSearchParams();
    params.set("tramite", title);
    params.set("checklist", checked.join(", "));

    router.push(`/pedir-cita?${params.toString()}`);
  };

  const progress = Math.round((checked.length / items.length) * 100);

  return (
    <>
      {/* PASO 2 */}
      <ProcessSteps currentStep={2} />

      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 pb-28">
          <h2 className="text-3xl font-semibold text-[var(--primary)] mb-6">
            {title}
          </h2>

          <p className="text-readable mb-10 max-w-2xl">{intro}</p>

          <div className="mb-14">
            <p className="text-sm text-gray-500 mb-2">
              Progreso: {checked.length} de {items.length} documentos
            </p>
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="space-y-6 mb-20">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-4 border-b border-gray-200 pb-4"
              >
                <input
                  type="checkbox"
                  checked={checked.includes(item)}
                  onChange={() => toggle(item)}
                  className="w-5 h-5 accent-[var(--primary)]"
                />
                <span className="text-readable">{item}</span>
              </li>
            ))}
          </ul>

          <Button onClick={handleContinue}>
            Continuar y pedir cita
          </Button>
        </div>
      </section>
    </>
  );
}
