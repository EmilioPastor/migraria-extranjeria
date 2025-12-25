import Checklist from "@/components/checklist/Checklist";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import reagrupacionData from "@/data/checklists/reagrupacion-familiar.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reagrupación familiar en España | Abogados de extranjería",
  description:
    "Información legal sobre la reagrupación familiar en España. Requisitos, plazos y asesoramiento jurídico especializado.",
};

export default function ReagrupacionFamiliarPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--primary)] text-white section-lg">
        <div className="max-w-5xl mx-auto px-6">
          <p className="uppercase tracking-wide text-white/70 mb-4">
            Régimen general
          </p>

          <h1 className="text-5xl font-semibold mb-6">
            Reagrupación familiar
          </h1>

          <p className="text-lg text-white/80 max-w-3xl">
            Procedimiento que permite a las personas extranjeras residentes
            legales en España reagrupar a determinados familiares para que
            residan con ellas en el país.
          </p>

          <div className="mt-10">
            <Button
              href="/pedir-cita?tipo=extranjeria"
              variant="secondary"
            >
              Pedir cita para reagrupación familiar
            </Button>
          </div>
        </div>
      </section>

      {/* RESUMEN */}
      <section className="bg-white section">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <Card title="¿Quién puede reagrupar?">
            Personas extranjeras con residencia legal y medios económicos
            suficientes en España.
          </Card>

          <Card title="¿A quién se puede reagrupar?">
            Cónyuge o pareja registrada, hijos menores o dependientes y
            ascendientes en determinados supuestos.
          </Card>

          <Card title="Plazo orientativo">
            Entre 2 y 6 meses, dependiendo del consulado y la provincia.
          </Card>
        </div>
      </section>

      {/* CHECKLIST */}
      <Checklist data={reagrupacionData} tipoCita="extranjeria" />

      {/* CTA FINAL */}
      <section className="bg-[var(--primary)] text-white section">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">
            ¿Quieres reagrupar a tu familia en España?
          </h2>

          <p className="mt-6 text-white/80">
            Estudiamos tu situación familiar y económica para iniciar el
            procedimiento con garantías.
          </p>

          <div className="mt-10">
            <Button
              href="/pedir-cita?tipo=extranjeria"
              variant="secondary"
            >
              Pedir cita y revisar mi caso
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
