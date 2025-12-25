import Checklist from "@/components/checklist/Checklist";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import nomadaData from "@/data/checklists/nomada-digital.json";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Visado de nómada digital en España | Abogados",
  description:
    "Asesoramiento jurídico sobre la residencia para nómadas digitales en España. Requisitos legales y procedimiento.",
};

export default function NomadaDigitalPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--primary)] text-white section-lg">
        <div className="max-w-5xl mx-auto px-6">
          <p className="uppercase tracking-wide text-white/70 mb-4">
            Régimen especial
          </p>

          <h1 className="text-5xl font-semibold mb-6">
            Nómada digital
          </h1>

          <p className="text-lg text-white/80 max-w-3xl">
            Autorización de residencia dirigida a profesionales que desarrollan
            su actividad laboral o profesional en remoto desde España para
            empresas o clientes situados en el extranjero.
          </p>

          <div className="mt-10">
            <Button
              href="/pedir-cita?tipo=nomada"
              variant="secondary"
            >
              Pedir cita para nómada digital
            </Button>
          </div>
        </div>
      </section>

      {/* RESUMEN */}
      <section className="bg-white section">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <Card title="¿Quién puede solicitarla?">
            Profesionales que trabajan en remoto para empresas extranjeras o
            autónomos con clientes fuera de España.
          </Card>

          <Card title="¿Qué permite?">
            Residir legalmente en España manteniendo la actividad profesional
            internacional.
          </Card>

          <Card title="Duración inicial">
            Autorización inicial de hasta 3 años, renovable.
          </Card>
        </div>
      </section>

      {/* CHECKLIST */}
      <Checklist data={nomadaData} tipoCita="nomada" />

      {/* CTA FINAL */}
      <section className="bg-[var(--primary)] text-white section">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">
            ¿Trabajas en remoto y quieres vivir en España?
          </h2>

          <p className="mt-6 text-white/80">
            Analizamos tu situación laboral y fiscal para confirmar si cumples
            los requisitos del régimen de nómada digital.
          </p>

          <div className="mt-10">
            <Button
              href="/pedir-cita?tipo=nomada"
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
