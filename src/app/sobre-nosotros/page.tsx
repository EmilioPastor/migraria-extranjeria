import Button from "@/components/ui/Button";

export default function SobreNosotrosPage() {
  return (
    <>
      {/* =========================
          HERO
         ========================= */}
      <section className="bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <p className="uppercase tracking-widest text-white/60 mb-6 text-sm">
            Sobre nosotros
          </p>

          <h1 className="text-5xl font-semibold leading-tight mb-10 max-w-3xl">
            Especialización, criterio jurídico  
            <br />
            <span className="text-white/80">
              y acompañamiento profesional
            </span>
          </h1>

          <p className="text-lg text-white/80 max-w-2xl">
            MIGRARIA EXTRANJERÍA es un despacho especializado en derecho de
            extranjería e inmigración, orientado a ofrecer asesoramiento jurídico
            claro, honesto y ajustado a la normativa vigente.
          </p>
        </div>
      </section>

      {/* =========================
          QUIÉNES SOMOS
         ========================= */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-24">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--primary)] mb-8">
              Quiénes somos
            </h2>

            <p className="text-readable mb-6">
              Somos un despacho centrado exclusivamente en el ámbito de la
              extranjería, la inmigración y la nacionalidad, lo que nos permite
              conocer en profundidad tanto la legislación aplicable como la
              práctica administrativa real.
            </p>

            <p className="text-readable">
              Nuestro trabajo se basa en el estudio individualizado de cada
              caso, evitando soluciones genéricas y ofreciendo siempre una
              valoración honesta sobre la viabilidad de cada procedimiento.
            </p>
          </div>

          <div className="border-l-2 border-[var(--primary)] pl-12">
            <p className="uppercase text-xs tracking-widest text-[var(--primary)] mb-4">
              Principios
            </p>

            <ul className="space-y-6 text-lg">
              <li>Rigor jurídico y actualización constante</li>
              <li>Transparencia en plazos y expectativas</li>
              <li>Comunicación clara y accesible</li>
              <li>Acompañamiento durante todo el procedimiento</li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================
          MÉTODO DE TRABAJO
         ========================= */}
      <section className="bg-[var(--bg-soft)]">
        <div className="max-w-7xl mx-auto px-6 py-28">
          <h2 className="text-3xl font-semibold text-[var(--primary)] mb-20">
            Nuestra forma de trabajar
          </h2>

          <div className="grid md:grid-cols-4 gap-16">
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-4">01</p>
              <h3 className="text-xl font-semibold mb-4">
                Análisis del caso
              </h3>
              <p className="text-readable">
                Estudiamos tu situación personal y administrativa de forma
                individual, conforme a la normativa vigente.
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--text-muted)] mb-4">02</p>
              <h3 className="text-xl font-semibold mb-4">
                Estrategia legal
              </h3>
              <p className="text-readable">
                Definimos el procedimiento más adecuado y los pasos necesarios
                para su correcta tramitación.
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--text-muted)] mb-4">03</p>
              <h3 className="text-xl font-semibold mb-4">
                Preparación del expediente
              </h3>
              <p className="text-readable">
                Te guiamos en la recopilación y revisión de la documentación
                exigida para evitar errores.
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--text-muted)] mb-4">04</p>
              <h3 className="text-xl font-semibold mb-4">
                Seguimiento
              </h3>
              <p className="text-readable">
                Realizamos un seguimiento del procedimiento hasta su resolución
                y te mantenemos informado en todo momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CIERRE
         ========================= */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-28 text-center">
          <h2 className="text-3xl font-semibold text-[var(--primary)] mb-8">
            Un enfoque jurídico serio y responsable
          </h2>

          <p className="text-lg text-readable max-w-3xl mx-auto">
            Cada situación migratoria es distinta. Por ello, ofrecemos un
            asesoramiento personalizado, basado en el análisis jurídico y en la
            experiencia práctica en materia de extranjería.
          </p>

          <div className="mt-14">
            <Button href="/pedir-cita">
              Solicitar cita
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
