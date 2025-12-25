import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <>
      {/* =========================
          HERO INSTITUCIONAL
         ========================= */}
      <section className="bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-6 py-36 grid md:grid-cols-2 gap-24 items-center">
          <div>
            <Image
              src="/logo/migraria-logo.png"
              alt="Migraria Extranjería"
              width={240}
              height={80}
              priority
              className="mb-12"
            />

            <h1 className="text-5xl font-semibold leading-tight">
              Especialistas en extranjería, inmigración y nacionalidad española
            </h1>

            <p className="mt-8 text-lg text-white/80 max-w-xl">
              Asesoramiento jurídico riguroso para personas, profesionales y
              empresas que necesitan seguridad legal en sus procedimientos de
              extranjería en España.
            </p>

            <div className="mt-14 flex gap-6">
              <Button href="/pedir-cita" variant="secondary">
                Pedir cita online
              </Button>

              <Button href="/servicios" variant="secondary">
                Ver servicios
              </Button>
            </div>
          </div>

          {/* BLOQUE VISUAL CON MARCO */}
          <div className="border border-white/20 p-10">
            <p className="text-sm uppercase tracking-wide text-white/60 mb-4">
              Despacho especializado
            </p>
            <p className="text-xl leading-relaxed">
              Actuamos exclusivamente en el ámbito del derecho de extranjería,
              lo que nos permite ofrecer un conocimiento actualizado y una
              estrategia jurídica sólida en cada caso.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          BLOQUE IDENTIDAD
         ========================= */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-3 gap-20">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)] mb-4">
              Especialización
            </p>
            <h2 className="text-2xl font-semibold text-[var(--primary)]">
              Dedicación exclusiva a extranjería
            </h2>
          </div>

          <div className="md:col-span-2 text-[var(--text-muted)] text-lg">
            No somos un despacho generalista. Nuestra práctica está centrada
            exclusivamente en extranjería e inmigración, lo que nos permite
            conocer en profundidad los criterios administrativos y aplicar la
            normativa con rigor y precisión.
          </div>
        </div>
      </section>

      {/* =========================
          SERVICIOS DESTACADOS
         ========================= */}
      <section className="bg-[var(--bg-soft)]">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="flex items-end justify-between mb-20">
            <h2 className="text-3xl font-semibold text-[var(--primary)]">
              Servicios principales
            </h2>
            <p className="text-[var(--text-muted)] max-w-md">
              Procedimientos habituales en los que prestamos asesoramiento
              jurídico especializado.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-10">
            <Card title="Arraigos y regularización">
              Procedimientos de arraigo y otras vías de regularización conforme a
              la normativa vigente.
            </Card>

            <Card title="Nacionalidad española">
              Asesoramiento y tramitación del procedimiento de adquisición de la
              nacionalidad española.
            </Card>

            <Card title="Nómadas digitales">
              Residencia para profesionales que desarrollan su actividad en
              remoto desde España.
            </Card>

            <Card title="Profesionales cualificados">
              Autorizaciones para perfiles altamente cualificados y empresas.
            </Card>
          </div>
        </div>
      </section>

      {/* =========================
          BLOQUE MÉTODO
         ========================= */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-3 gap-16">
          <Card title="Análisis jurídico previo">
            Cada caso se estudia de forma individual antes de iniciar cualquier
            actuación, valorando su viabilidad real.
          </Card>

          <Card title="Información clara y honesta">
            Explicamos el procedimiento, los plazos y los riesgos de forma
            comprensible, sin generar falsas expectativas.
          </Card>

          <Card title="Seguimiento continuo">
            Acompañamos al cliente durante todo el procedimiento administrativo,
            manteniendo una comunicación constante.
          </Card>
        </div>
      </section>

      {/* =========================
          CTA FINAL CONTUNDENTE
         ========================= */}
      <section className="bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-semibold">
              ¿Necesitas asesoramiento legal en extranjería?
            </h2>

            <p className="mt-6 text-white/80 max-w-xl">
              Solicita una cita online y analizaremos tu situación con criterio
              jurídico y total confidencialidad.
            </p>
          </div>

          <div className="flex md:justify-end">
            <Button href="/pedir-cita" variant="secondary">
              Pedir cita online
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
