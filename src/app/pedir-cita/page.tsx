"use client";

import { useSearchParams } from "next/navigation";
import ProcessSteps from "@/components/ui/ProcessSteps";

const CALENDLY_URLS: Record<string, string> = {
  extranjeria: "https://calendly.com/TU_CALENDLY_EXTRANJERIA",
  nomada: "https://calendly.com/TU_CALENDLY_NOMADA",
  pac: "https://calendly.com/TU_CALENDLY_PAC",
};

export default function PedirCitaPage() {
  const params = useSearchParams();
  const tipo = params.get("tipo") || "extranjeria";
  const checklist = params.get("checklist");

  const baseUrl = CALENDLY_URLS[tipo] || CALENDLY_URLS.extranjeria;

  const calendlyUrl = checklist
    ? `${baseUrl}?notes=${encodeURIComponent(checklist)}`
    : baseUrl;

  return (
    <>
      {/* PASO 3 */}
      <ProcessSteps currentStep={3} />

      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-4xl font-semibold text-[var(--primary)] mb-8">
            Solicitar cita
          </h1>

          <p className="text-readable mb-16 max-w-3xl">
            Selecciona el día y la hora disponibles. Revisaremos previamente la
            información indicada para ofrecerte un análisis más preciso.
          </p>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={calendlyUrl}
              width="100%"
              height="700"
              frameBorder="0"
              title="Calendly"
            />
          </div>
        </div>
      </section>
    </>
  );
}
