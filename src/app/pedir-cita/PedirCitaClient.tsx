"use client";

import { InlineWidget } from "react-calendly";
import { useSearchParams } from "next/navigation";

const CALENDLY_URL =
  "https://calendly.com/legal-pastorzurita/consulta-migraria-extranjeria";

export default function PedirCitaClient() {
  const params = useSearchParams();

  const tramite = params.get("tramite") || "";
  const checklist = params.get("checklist") || "";

  return (
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
  );
}
