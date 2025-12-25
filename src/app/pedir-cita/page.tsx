"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Cita = {
  label: string;
  key: string;
  desc: string;
  url: string;
};

const citas: Cita[] = [
  {
    label: "Extranjería",
    key: "extranjeria",
    desc: "Consultas generales sobre residencia, arraigo y regularización.",
    url: "https://calendly.com/TU_USUARIO/extranjeria",
  },
  {
    label: "Visado de estudio en origen",
    key: "estudio",
    desc: "Visados de estudios solicitados desde el país de origen.",
    url: "https://calendly.com/TU_USUARIO/visado-estudio",
  },
  {
    label: "Residencia no lucrativa",
    key: "no-lucrativa",
    desc: "Residencia en España sin realizar actividad laboral.",
    url: "https://calendly.com/TU_USUARIO/residencia-no-lucrativa",
  },
  {
    label: "Derecho laboral",
    key: "laboral",
    desc: "Asesoramiento en materia laboral.",
    url: "https://calendly.com/TU_USUARIO/derecho-laboral",
  },
  {
    label: "Homologación",
    key: "homologacion",
    desc: "Homologación y equivalencia de títulos.",
    url: "https://calendly.com/TU_USUARIO/homologacion",
  },
  {
    label: "Nómada digital",
    key: "nomada",
    desc: "Residencia para profesionales que trabajan en remoto.",
    url: "https://calendly.com/TU_USUARIO/nomada-digital",
  },
  {
    label: "Profesional altamente cualificado",
    key: "pac",
    desc: "Autorizaciones para perfiles altamente cualificados.",
    url: "https://calendly.com/TU_USUARIO/pac",
  },
];

export default function PedirCitaPage() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo");
  const checklist = searchParams.get("checklist");

  const [selected, setSelected] = useState<Cita | null>(null);

  useEffect(() => {
    if (tipo) {
      const found = citas.find((c) => c.key === tipo);
      if (found) setSelected(found);
    }
  }, [tipo]);

  return (
    <section className="bg-[var(--bg-soft)] section-lg">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-[var(--primary)]">
          Pedir cita online
        </h1>

        <p className="mt-6 text-lg text-readable">
          Reserva tu cita online. Si vienes desde un trámite concreto, el tipo de
          consulta se selecciona automáticamente.
        </p>

        {!selected && (
          <div className="mt-20 grid md:grid-cols-2 gap-16">
            {citas.map((cita) => (
              <Card key={cita.key} title={cita.label}>
                <p>{cita.desc}</p>

                <div className="mt-8">
                  <Button onClick={() => setSelected(cita)}>
                    Seleccionar y continuar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-24">
            <h2 className="text-2xl font-semibold text-[var(--primary)] mb-6">
              Reserva tu cita — {selected.label}
            </h2>

            <Card>
              <iframe
                src={`${selected.url}${
                  checklist ? `?notes=${checklist}` : ""
                }`}
                className="w-full h-[720px]"
                loading="lazy"
              />
            </Card>

            <div className="mt-8">
              <Button
                variant="secondary"
                onClick={() => setSelected(null)}
              >
                Cambiar tipo de consulta
              </Button>
            </div>
          </div>
        )}

        <p className="mt-20 text-sm text-[var(--text-muted)] max-w-4xl">
          La solicitud de cita no implica la aceptación del caso ni la prestación
          de asesoramiento legal previo.
        </p>
      </div>
    </section>
  );
}
