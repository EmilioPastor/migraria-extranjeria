import { Suspense } from "react";
import ProcessSteps from "@/components/ui/ProcessSteps";
import PedirCitaClient from "./PedirCitaClient";

export const metadata = {
  title: "Pedir cita | Migraria Extranjería",
};

export default function PedirCitaPage() {
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

          {/* 👇 CLAVE: Suspense */}
          <Suspense fallback={<div className="h-[820px]" />}>
            <PedirCitaClient />
          </Suspense>

          <p className="mt-6 text-sm text-gray-500">
            La reserva de cita no implica la aceptación del caso ni la prestación
            de asesoramiento jurídico previo.
          </p>
        </div>
      </section>
    </>
  );
}
