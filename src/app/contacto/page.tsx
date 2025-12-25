import Button from "@/components/ui/Button";

export default function ContactoPage() {
  return (
    <>
      {/* =========================
          HERO
         ========================= */}
      <section className="bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <p className="uppercase tracking-widest text-white/60 mb-6 text-sm">
            Contacto
          </p>

          <h1 className="text-5xl font-semibold leading-tight mb-10 max-w-3xl">
            Ponte en contacto con  
            <br />
            <span className="text-white/80">
              MIGRARIA EXTRANJERÍA
            </span>
          </h1>

          <p className="text-lg text-white/80 max-w-2xl">
            Si necesitas asesoramiento jurídico en materia de extranjería,
            puedes ponerte en contacto con nosotros o solicitar una cita online
            para el análisis de tu caso.
          </p>
        </div>
      </section>

      {/* =========================
          INFORMACIÓN DE CONTACTO
         ========================= */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-24">
          
          {/* DATOS */}
          <div>
            <h2 className="text-3xl font-semibold text-[var(--primary)] mb-10">
              Datos de contacto
            </h2>

            <div className="space-y-8 text-readable">
              <div>
                <p className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Correo electrónico
                </p>
                <p>[EMAIL DE CONTACTO]</p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Teléfono
                </p>
                <p>[TELÉFONO]</p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Dirección
                </p>
                <p>
                  [DIRECCIÓN COMPLETA] <br />
                  [CIUDAD, PROVINCIA]
                </p>
              </div>
            </div>

            <div className="mt-16">
              <Button href="/pedir-cita">
                Pedir cita online
              </Button>
            </div>
          </div>

          {/* TEXTO DE ORIENTACIÓN */}
          <div className="border-l-2 border-[var(--primary)] pl-12">
            <h3 className="text-2xl font-semibold mb-8">
              Antes de contactarnos
            </h3>

            <p className="text-readable mb-6">
              Para ofrecer un asesoramiento adecuado, es importante analizar
              cada caso de forma individual. Por ello, recomendamos solicitar
              una cita previa siempre que sea posible.
            </p>

            <p className="text-readable mb-6">
              Durante la cita, revisaremos tu situación administrativa,
              resolveremos tus dudas y te indicaremos la viabilidad real del
              procedimiento conforme a la normativa vigente.
            </p>

            <p className="text-sm text-[var(--text-muted)]">
              El contacto inicial no implica la aceptación del caso ni la
              prestación de asesoramiento jurídico previo.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          CIERRE
         ========================= */}
      <section className="bg-[var(--bg-soft)]">
        <div className="max-w-5xl mx-auto px-6 py-28 text-center">
          <h2 className="text-3xl font-semibold text-[var(--primary)] mb-8">
            Analizamos tu caso con criterio jurídico
          </h2>

          <p className="text-lg text-readable max-w-3xl mx-auto mb-14">
            Nuestro objetivo es ofrecer información clara y una valoración
            honesta sobre las opciones disponibles en materia de extranjería.
          </p>

          <Button href="/pedir-cita">
            Solicitar cita
          </Button>
        </div>
      </section>
    </>
  );
}
