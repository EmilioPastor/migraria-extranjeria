import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ContactoPage() {
  return (
    <section className="bg-[var(--bg-soft)]">
      <div className="max-w-7xl mx-auto px-6 py-32">
        {/* TÍTULO */}
        <h1 className="text-4xl font-semibold text-[var(--primary)]">
          Contacto
        </h1>

        {/* INTRO */}
        <p className="mt-8 text-lg text-[var(--text-muted)] max-w-4xl">
          Si tienes cualquier consulta relacionada con nuestros servicios de
          extranjería o necesitas asesoramiento legal, puedes ponerte en
          contacto con nosotros a través de los siguientes medios o solicitar
          directamente una cita online.
        </p>

        {/* BLOQUES */}
        <div className="mt-24 grid md:grid-cols-2 gap-16">
          {/* INFORMACIÓN DE CONTACTO */}
          <Card title="Información de contacto">
            <p>
              <strong>Correo electrónico</strong><br />
              contacto@migrariaextranjeria.com
            </p>

            <p className="mt-4">
              <strong>Teléfono</strong><br />
              +34 XXX XXX XXX
            </p>

            <p className="mt-4">
              <strong>Horario de atención</strong><br />
              Lunes a viernes, de 9:00 a 18:00
            </p>
          </Card>

          {/* CTA CITA */}
          <Card title="Solicitar cita">
            <p>
              Para recibir asesoramiento legal personalizado, te recomendamos
              solicitar una cita previa. Estudiaremos tu caso de forma
              individual y con total confidencialidad.
            </p>

            <div className="mt-8">
              <Button href="/pedir-cita">
                Pedir cita online
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
