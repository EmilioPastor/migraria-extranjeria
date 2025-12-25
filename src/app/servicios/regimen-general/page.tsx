import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function RegimenGeneralPage() {
  return (
    <section className="bg-[var(--bg-soft)] section-lg">
      <div className="max-w-7xl mx-auto px-6">
        {/* TÍTULO */}
        <h1 className="text-4xl font-semibold text-[var(--primary)]">
          Régimen general
        </h1>

        {/* INTRO */}
        <p className="mt-8 text-lg text-readable">
          El régimen general de extranjería regula los procedimientos ordinarios
          de residencia, trabajo, arraigo, reagrupación familiar y acceso a la
          nacionalidad española.
        </p>

        {/* BLOQUE TRÁMITES */}
        <div className="mt-24 grid md:grid-cols-2 gap-16">
          {/* ARRAIGO SOCIAL */}
          <Card title="Arraigo social">
            <p>
              Autorización de residencia temporal por circunstancias
              excepcionales para personas que acreditan permanencia continuada
              en España y vínculos sociales o familiares.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-general/arraigo-social">
                Ver información y checklist
              </Button>
            </div>
          </Card>

          {/* ARRAIGO SOCIOFORMATIVO */}
          <Card title="Arraigo socioformativo">
            <p>
              Residencia temporal vinculada a la realización de estudios o
              formación reglada como vía de regularización.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-general/arraigo-socioformativo">
                Ver información y checklist
              </Button>
            </div>
          </Card>

          {/* RESIDENCIA Y TRABAJO */}
          <Card title="Residencia y trabajo">
            <p>
              Autorizaciones iniciales de residencia y trabajo por cuenta ajena o
              por cuenta propia.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-general/residencia-y-trabajo">
                Ver información y requisitos
              </Button>
            </div>
          </Card>

          {/* REAGRUPACIÓN FAMILIAR */}
          <Card title="Reagrupación familiar">
            <p>
              Procedimiento para que familiares de extranjeros residentes
              legales puedan residir en España.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-general/reagrupacion-familiar">
                Ver información y checklist
              </Button>
            </div>
          </Card>

          {/* NACIONALIDAD */}
          <Card title="Nacionalidad española">
            <p>
              Procedimiento de adquisición de la nacionalidad española por
              residencia u otras vías legales.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-general/nacionalidad">
                Ver información y checklist
              </Button>
            </div>
          </Card>
        </div>

        {/* CTA FINAL */}
        <div className="mt-32 text-center">
          <p className="mb-6 text-[var(--text-muted)]">
            Si no tienes claro qué procedimiento se adapta a tu situación,
            podemos orientarte de forma personalizada.
          </p>

          <Button href="/pedir-cita">
            Pedir cita y revisar mi caso
          </Button>
        </div>
      </div>
    </section>
  );
}
