import Checklist from "@/components/checklist/Checklist";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import nacionalidadData from "@/data/checklists/nacionalidad.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nacionalidad española por residencia | Abogados",
    description:
        "Información legal sobre la nacionalidad española por residencia. Requisitos, plazos orientativos y asesoramiento jurídico especializado.",
};

export default function NacionalidadPage() {
    return (
        <>
            {/* =========================
          HERO DEL TRÁMITE
         ========================= */}
            <section className="bg-[var(--primary)] text-white section-lg">
                <div className="max-w-5xl mx-auto px-6">
                    <p className="uppercase tracking-wide text-white/70 mb-4">
                        Régimen general
                    </p>

                    <h1 className="text-5xl font-semibold mb-6">
                        Nacionalidad española
                    </h1>

                    <p className="text-lg text-white/80 max-w-3xl">
                        Procedimiento mediante el cual una persona extranjera puede adquirir
                        la nacionalidad española tras cumplir un periodo legal de residencia
                        continuada en España y otros requisitos establecidos por la ley.
                    </p>

                    <div className="mt-10">
                        <Button
                            href="/pedir-cita?tipo=extranjeria"
                            variant="secondary"
                        >
                            Pedir cita para nacionalidad española
                        </Button>
                    </div>
                </div>
            </section>

            {/* =========================
          BLOQUE RESUMEN VISUAL
         ========================= */}
            <section className="bg-white section">
                <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-16">
                    <Card title="¿Quién puede solicitarla?">
                        Personas extranjeras que acrediten residencia legal y continuada en
                        España durante el plazo exigido legalmente, así como buena conducta
                        cívica.
                    </Card>

                    <Card title="¿Qué se obtiene?">
                        La adquisición de la nacionalidad española, con los derechos y
                        deberes inherentes a la condición de ciudadano español.
                    </Card>

                    <Card title="Plazo orientativo">
                        El procedimiento puede tardar entre 1 y 3 años, dependiendo de la
                        carga administrativa y de la vía de solicitud.
                    </Card>
                </div>
            </section>

            {/* =========================
          CHECKLIST
         ========================= */}
            <Checklist data={nacionalidadData} tipoCita="extranjeria" />

            {/* =========================
          CTA FINAL
         ========================= */}
            <section className="bg-[var(--primary)] text-white section">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold">
                        ¿Cumples los requisitos para solicitar la nacionalidad?
                    </h2>

                    <p className="mt-6 text-white/80">
                        Revisamos tu situación personal, el tiempo de residencia y la
                        documentación necesaria para iniciar el procedimiento con garantías.
                    </p>

                    <div className="mt-10">
                        <Button
                            href="/pedir-cita?tipo=extranjeria"
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
