import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function RegimenEspecialPage() {
  return (
    <section className="bg-[var(--bg-soft)] section-lg">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-[var(--primary)]">
          Régimen especial
        </h1>

        <p className="mt-8 text-lg text-readable">
          El régimen especial de extranjería regula autorizaciones específicas
          para profesionales, trabajadores internacionales y perfiles
          cualificados que desarrollan su actividad en España bajo supuestos
          concretos.
        </p>

        <div className="mt-24 grid md:grid-cols-2 gap-16">
          <Card title="Nómada digital">
            <p>
              Autorización de residencia para profesionales que trabajan en
              remoto para empresas extranjeras o como autónomos internacionales.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-especial/nomada-digital">
                Ver información y checklist
              </Button>
            </div>
          </Card>

          <Card title="Profesional altamente cualificado">
            <p>
              Autorización dirigida a perfiles profesionales cualificados
              contratados por empresas en España o trasladados por multinacionales.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-especial/pac">
                Ver información y checklist
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-32 text-center">
          <p className="mb-6 text-[var(--text-muted)]">
            Si no tienes claro qué autorización se ajusta a tu perfil profesional,
            podemos orientarte de forma personalizada.
          </p>

          <Button href="/pedir-cita?tipo=extranjeria">
            Pedir cita y revisar mi caso
          </Button>
        </div>
      </div>
    </section>
  );
}
