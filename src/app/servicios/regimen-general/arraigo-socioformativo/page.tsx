import Checklist from "@/components/checklist/Checklist";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import socioformativoData from "@/data/checklists/arraigo-socioformativo.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Arraigo socioformativo | Abogados de extranjería",
    description:
        "Asesoramiento jurídico sobre el arraigo socioformativo en España. Requisitos legales, documentación y viabilidad del procedimiento.",
};

export default function ArraigoSocioformativoPage() {
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
                        Arraigo socioformativo
                    </h1>

                    <p className="text-lg text-white/80 max-w-3xl">
                        Vía de regularización para personas extranjeras que, tras un periodo
                        de permanencia en España, se comprometen a realizar una formación
                        reglada u oficial.
                    </p>

                    <div className="mt-10">
                        <Button
                            href="/pedir-cita?tipo=extranjeria"
                            variant="secondary"
                        >
                            Pedir cita para arraigo socioformativo
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
                        y deseen regularizar su situación mediante formación.
                    </Card>

                    <Card title="¿Qué permite?">
                        Obtener una autorización de residencia temporal vinculada a la
                        realización de estudios o formación oficial.
                    </Card>

                    <Card title="Duración inicial">
                        Autorización inicial generalmente vinculada a la duración de la
                        formación autorizada.
                    </Card>
                </div>
            </section>

            {/* =========================
          CHECKLIST
         ========================= */}
            <Checklist data={socioformativoData} tipoCita="extranjeria" />

            {/* =========================
          CTA FINAL
         ========================= */}
            <section className="bg-[var(--primary)] text-white section">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold">
                        ¿Quieres saber si esta vía es viable para ti?
                    </h2>

                    <p className="mt-6 text-white/80">
                        Analizamos tu situación concreta y te indicamos si el arraigo
                        socioformativo es la opción más adecuada en tu caso.
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
