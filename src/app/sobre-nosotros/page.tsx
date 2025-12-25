import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function SobreNosotrosPage() {
  return (
    <section className="bg-[var(--bg-soft)]">
      <div className="max-w-7xl mx-auto px-6 py-32">
        {/* TÍTULO */}
        <h1 className="text-4xl font-semibold text-[var(--primary)]">
          Sobre Migraria Extranjería
        </h1>

        {/* INTRO */}
        <p className="mt-8 text-lg text-[var(--text-muted)] max-w-4xl">
          Migraria Extranjería es un despacho especializado en derecho de
          extranjería e inmigración, orientado a ofrecer asesoramiento legal
          riguroso, claro y adaptado a cada situación personal o profesional.
        </p>

        <p className="mt-6 text-[var(--text-muted)] max-w-4xl">
          Nuestra dedicación exclusiva a esta área del derecho nos permite
          trabajar con un conocimiento actualizado de la normativa y de los
          criterios administrativos aplicables en cada procedimiento.
        </p>

        {/* CÓMO TRABAJAMOS */}
        <div className="mt-28">
          <h2 className="text-3xl font-semibold text-[var(--primary)] mb-16">
            Cómo trabajamos
          </h2>

          <div className="grid md:grid-cols-3 gap-16">
            <Card title="Estudio previo del caso">
              Analizamos cada situación de forma individual antes de iniciar
              cualquier trámite, valorando la viabilidad real y las posibles
              alternativas legales.
            </Card>

            <Card title="Información clara y honesta">
              Explicamos el procedimiento, los requisitos y los plazos de forma
              comprensible, sin generar expectativas que no se ajusten a la
              realidad jurídica.
            </Card>

            <Card title="Acompañamiento continuo">
              Acompañamos al cliente durante todas las fases del procedimiento,
              desde la preparación de la solicitud hasta su resolución.
            </Card>
          </div>
        </div>

        {/* COMPROMISO */}
        <div className="mt-32 max-w-4xl">
          <h2 className="text-3xl font-semibold text-[var(--primary)]">
            Compromiso profesional
          </h2>

          <p className="mt-8 text-[var(--text-muted)]">
            En Migraria Extranjería trabajamos con un firme compromiso de rigor
            jurídico, confidencialidad y responsabilidad profesional. Nuestro
            objetivo es ofrecer soluciones legales sólidas, siempre dentro del
            marco normativo vigente y con total transparencia.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-24">
          <Button href="/pedir-cita" variant="secondary">
            Solicitar cita
          </Button>
        </div>
      </div>
    </section>
  );
}
