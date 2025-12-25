import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ServiciosPage() {
  return (
    <section className="bg-[var(--bg-soft)]">
      <div className="max-w-7xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-semibold text-[var(--primary)]">
          Servicios de extranjería
        </h1>

        <p className="mt-8 text-lg text-[var(--text-muted)] max-w-3xl">
          Ofrecemos asesoramiento y tramitación legal en procedimientos de
          extranjería, inmigración y nacionalidad española, adaptados a cada
          situación personal o profesional.
        </p>

        <div className="mt-24 grid md:grid-cols-2 gap-20">
          <Card title="Régimen general">
            <p>
              Procedimientos ordinarios de residencia, trabajo, arraigo,
              reagrupación familiar y nacionalidad conforme a la Ley de
              Extranjería.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-general">
                Ver servicios de régimen general
              </Button>
            </div>
          </Card>

          <Card title="Régimen especial">
            <p>
              Autorizaciones específicas para profesionales cualificados,
              emprendedores, movilidad internacional y trabajo en remoto.
            </p>

            <div className="mt-8">
              <Button href="/servicios/regimen-especial">
                Ver servicios de régimen especial
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
