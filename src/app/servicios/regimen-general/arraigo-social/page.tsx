import Checklist from "@/components/checklist/Checklist";
import arraigoData from "@/data/checklists/arraigo.json";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Arraigo social en España | Abogados de extranjería",
    description:
        "Información legal sobre el procedimiento de arraigo social en España. Requisitos, documentación y asesoramiento jurídico especializado en extranjería.",
};

export default function ArraigoSocialPage() {
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
                        Arraigo social
                    </h1>

                    <p className="text-lg text-white/80 max-w-3xl">
                        Vía de regularización para personas extranjeras que han vivido en
                        España de forma continuada y cuentan con vínculos sociales o
                        familiares en el país.
                    </p>

                    <div className="mt-10">
                        <Button
                            href="/pedir-cita?tipo=extranjeria"
                            variant="secondary"
                        >
                            Pedir cita para arraigo social
                        </Button>
                    </div>
                </div>
            </section>

            {/* =========================
          BLOQUE RESUMEN VISUAL
         ========================= */}
            <section className="bg-white section">
                <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-16">
                    <Card title="¿Para quién es?">
                        Personas extranjeras que acrediten permanencia continuada en España
                        y vínculos sociales o familiares.
                    </Card>

                    <Card title="¿Qué permite?">
                        Obtener una autorización de residencia temporal y, en determinados
                        casos, autorización de trabajo.
                    </Card>

                    <Card title="Tiempo estimado">
                        Tramitación orientativa entre 2 y 5 meses, dependiendo de la
                        provincia y la carga administrativa.
                    </Card>
                </div>
            </section>

            {/* =========================
          CHECKLIST
         ========================= */}
            <Checklist data={arraigoData} tipoCita="extranjeria" />

            {/* =========================
          CTA FINAL
         ========================= */}
            <section className="bg-[var(--primary)] text-white section">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold">
                        ¿Quieres confirmar si esta es tu mejor opción?
                    </h2>

                    <p className="mt-6 text-white/80">
                        Revisamos tu situación concreta y te indicamos si el arraigo social
                        es viable en tu caso.
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
