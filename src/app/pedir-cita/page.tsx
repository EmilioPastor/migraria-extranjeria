"use client";

import { InlineWidget } from "react-calendly";
import { useSearchParams } from "next/navigation";
import ProcessSteps from "@/components/ui/ProcessSteps";

const CALENDLY_URL =
  "https://calendly.com/legal-pastorzurita/consulta-migraria-extranjeria";

export default function PedirCitaPage() {
  const params = useSearchParams();

  const tramite = params.get("tramite") || "";
  const checklist = params.get("checklist") || "";

  return (
    <>
      {/* PASO 3 */}
      <ProcessSteps currentStep={3} />

      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-semibold text-[var(--primary)] mb-6">
            Solicitar cita
          </h1>

          <p className="text-readable mb-10 max-w-3xl">
            Selecciona el día y la hora disponibles. Si has llegado desde un
            trámite concreto, la información se cargará automáticamente.
          </p>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <InlineWidget
              url={CALENDLY_URL}
              /*
               * a1 -> Tipo de trámite
               * a2 -> Documentación disponible
               * Si no vienen params (navbar), se cargan vacíos
               */
              prefill={{
                customAnswers: {
                  a1: tramite,
                  a2: checklist,
                },
              }}
              pageSettings={{
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: "0b3a5a",
              }}
              styles={{ height: "820px" }}
            />
          </div>

          <p className="mt-6 text-sm text-gray-500">
            La reserva de cita no implica la aceptación del caso ni la prestación
            de asesoramiento jurídico previo.
          </p>
        </div>
      </section>
    </>
  );
}
