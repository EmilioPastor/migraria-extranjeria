import Link from "next/link";
import servicios from "@/data/servicios.json";
import ProcessSteps from "@/components/ui/ProcessSteps";

export default function ServiciosPage() {
  return (
    <>
      {/* PASO 1 — SIEMPRE */}
      <ProcessSteps currentStep={1} />

      {/* HERO */}
      <section className="bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <p className="uppercase tracking-widest text-white/60 mb-6 text-sm">
            Servicios
          </p>

          <h1 className="text-5xl font-semibold leading-tight max-w-4xl">
            Identifica tu situación  
            <br />
            <span className="text-white/80">
              y accede al trámite correspondiente
            </span>
          </h1>
        </div>
      </section>

      {/* BLOQUES */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-32 space-y-32">
          {servicios.map((bloque) => (
            <section key={bloque.id}>
              <h2 className="text-4xl font-semibold text-[var(--primary)] mb-8">
                {bloque.title}
              </h2>

              <p className="text-readable mb-14 max-w-2xl">
                {bloque.description}
              </p>

              <ul className="space-y-6 text-lg">
                {bloque.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="service-item">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
