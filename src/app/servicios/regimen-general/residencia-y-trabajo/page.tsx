import Checklist from "@/components/checklist/Checklist";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import residenciaTrabajoData from "@/data/checklists/residencia-trabajo.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Residencia y trabajo en España | Abogados de extranjería",
    description:
        "Procedimiento de residencia y trabajo en España. Requisitos legales, documentación necesaria y asesoramiento jurídico en extranjería.",
};

export default function ResidenciaTrabajoPage() {
    return (
        <>
            {/* HERO */}
            <section className="bg-[var(--primary)] text-white section-lg">
                <div className="max-w-5xl mx-auto px-6">
                    <p className="uppercase tracking-wide text-white/70 mb-4">
                        Régimen general
                    </p>

                    <h1 className="text-5xl font-semibold mb-6">
                        Residencia y trabajo
                    </h1>

                    <p className="text-lg text-white/80 max-w-3xl">
                        Autorización inicial de residencia temporal y trabajo por cuenta
                        ajena o por cuenta propia para personas extranjeras que desean
                        desarrollar una actividad laboral en España.
                    </p>

                    <div className="mt-10">
                        <Button
                            href="/pedir-cita?tipo=extranjeria"
                            variant="secondary"
                        >
                            Pedir cita para residencia y trabajo
                        </Button>
                    </div>
                </div>
            </section>

            {/* RESUMEN */}
            <section className="bg-white section">
                <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-16">
                    <Card title="¿Quién puede solicitarla?">
                        Personas extranjeras que cuenten con una oferta de empleo válida
                        o que pretendan ejercer una actividad por cuenta propia.
                    </Card>

                    <Card title="¿Qué permite?">
                        Residir legalmente en España y trabajar conforme a la autorización
                        concedida.
                    </Card>

                    <Card title="Duración inicial">
                        Autorización inicial generalmente de un año, renovable.
                    </Card>
                </div>
            </section>

            {/* CHECKLIST */}
            <Checklist data={residenciaTrabajoData} tipoCita="extranjeria" />

            {/* CTA FINAL */}
            <section className="bg-[var(--primary)] text-white section">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold">
                        ¿Cumples los requisitos para trabajar en España?
                    </h2>

                    <p className="mt-6 text-white/80">
                        Analizamos tu situación laboral y administrativa para valorar la
                        viabilidad del procedimiento.
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
