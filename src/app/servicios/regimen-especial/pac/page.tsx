import Checklist from "@/components/checklist/Checklist";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import pacData from "@/data/checklists/pac.json";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profesional altamente cualificado | Abogados extranjería",
  description:
    "Autorización de residencia para profesionales altamente cualificados en España. Información legal y asesoramiento especializado.",
};

export default function PacPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--primary)] text-white section-lg">
        <div className="max-w-5xl mx-auto px-6">
          <p className="uppercase tracking-wide text-white/70 mb-4">
            Régimen especial
          </p>

          <h1 className="text-5xl font-semibold mb-6">
            Profesional altamente cualificado
          </h1>

          <p className="text-lg text-white/80 max-w-3xl">
            Autorización dirigida a profesionales con alta cualificación
            contratados por empresas en España o trasladados por grupos
            empresariales internacionales.
          </p>

          <div className="mt-10">
            <Button
              href="/pedir-cita?tipo=pac"
              variant="secondary"
            >
              Pedir cita para profesional cualificado
            </Button>
          </div>
        </div>
      </section>

      {/* RESUMEN */}
      <section className="bg-white section">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <Card title="Perfil requerido">
            Profesionales con titulación superior o experiencia acreditada
            equivalente.
          </Card>

          <Card title="¿Qué permite?">
            Residir y trabajar en España mediante un procedimiento ágil y
            centralizado.
          </Card>

          <Card title="Plazo orientativo">
            Tramitación acelerada, generalmente inferior a 30 días.
          </Card>
        </div>
      </section>

      {/* CHECKLIST */}
      <Checklist data={pacData} tipoCita="pac" />

      {/* CTA FINAL */}
      <section className="bg-[var(--primary)] text-white section">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">
            ¿Cumples el perfil de profesional cualificado?
          </h2>

          <p className="mt-6 text-white/80">
            Estudiamos tu perfil profesional y la oferta de empleo para confirmar
            la viabilidad de esta autorización.
          </p>

          <div className="mt-10">
            <Button
              href="/pedir-cita?tipo=pac"
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
