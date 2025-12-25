import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function HomePage() {
  return (
    <>
      {/* =========================
          HERO PRINCIPAL
         ========================= */}
      <section className="bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="uppercase tracking-widest text-white/60 mb-6 text-sm">
              Abogados de extranjería
            </p>

            <h1 className="text-5xl font-semibold leading-tight mb-8">
              Asesoramiento jurídico en extranjería  
              <br />
              <span className="text-white/80">
                claro, riguroso y personalizado
              </span>
            </h1>

            <p className="text-lg text-white/80 max-w-xl">
              En MIGRARIA EXTRANJERÍA analizamos cada caso de forma individual,
              conforme a la normativa vigente, para ofrecer un asesoramiento
              jurídico serio y transparente en materia de inmigración y
              nacionalidad.
            </p>

            <div className="mt-12 flex gap-6">
              <Button href="/pedir-cita" variant="secondary">
                Pedir cita online
              </Button>

              <Button href="/servicios" variant="ghost">
                Ver servicios
              </Button>
            </div>
          </div>

          {/* BLOQUE DE CONFIANZA */}
          <div className="bg-white/10 border border-white/20 rounded-xl p-10">
            <ul className="space-y-6 text-white/90">
              <li>✓ Análisis individualizado de cada caso</li>
              <li>✓ Información jurídica clara y realista</li>
              <li>✓ Especialización en extranjería e inmigración</li>
              <li>✓ Preparación previa antes de la cita</li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================
          BLOQUE DIFERENCIAL
         ========================= */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-28">
          <h2 className="text-3xl font-semibold text-[var(--primary)] mb-16 max-w-3xl">
            Un enfoque profesional orientado a resolver, no a prometer
          </h2>

          <div className="grid md:grid-cols-3 gap-16">
            <Card title="Rigor jurídico">
              Cada procedimiento se analiza conforme a la normativa vigente y
              a los criterios administrativos aplicables en cada caso.
            </Card>

            <Card title="Transparencia">
              Explicamos la viabilidad real de cada trámite, evitando falsas
              expectativas o promesas irreales.
            </Card>

            <Card title="Acompañamiento">
              Guiamos al cliente durante todo el proceso, desde la preparación
              inicial hasta la resolución del expediente.
            </Card>
          </div>
        </div>
      </section>

      {/* =========================
          SERVICIOS DESTACADOS
         ========================= */}
      <section className="bg-[var(--bg-soft)]">
        <div className="max-w-7xl mx-auto px-6 py-28">
          <h2 className="text-3xl font-semibold text-[var(--primary)] mb-16">
            Servicios de extranjería
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            <Card title="Arraigos y regularización">
              Asesoramiento en procedimientos de arraigo y regularización por
              circunstancias excepcionales.
            </Card>

            <Card title="Nacionalidad española">
              Nacionalidad por residencia, opción y otros supuestos conforme a
              la normativa vigente.
            </Card>

            <Card title="Residencia y trabajo">
              Autorizaciones iniciales y renovaciones de residencia y trabajo.
            </Card>

            <Card title="Reagrupación familiar">
              Procedimientos para reagrupar a familiares conforme a la ley.
            </Card>

            <Card title="Nómada digital">
              Autorizaciones para profesionales que trabajan en remoto desde
              España.
            </Card>

            <Card title="Profesionales cualificados">
              Procedimientos especiales para perfiles altamente cualificados.
            </Card>
          </div>

          <div className="mt-20 text-center">
            <Button href="/servicios">
              Ver todos los servicios
            </Button>
          </div>
        </div>
      </section>

      {/* =========================
          CTA FINAL
         ========================= */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-28 text-center">
          <h2 className="text-3xl font-semibold text-[var(--primary)] mb-8">
            ¿Necesitas asesoramiento en extranjería?
          </h2>

          <p className="text-lg text-readable max-w-3xl mx-auto">
            Solicita una cita online y analizaremos tu situación conforme a la
            normativa vigente, de forma clara y profesional.
          </p>

          <div className="mt-12">
            <Button href="/pedir-cita">
              Pedir cita online
            </Button>
          </div>

          <p className="mt-10 text-sm text-[var(--text-muted)]">
            La solicitud de cita no implica la aceptación del caso ni la
            prestación de asesoramiento jurídico previo.
          </p>
        </div>
      </section>
    </>
  );
}
