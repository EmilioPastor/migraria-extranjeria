export default function AvisoLegalPage() {
  return (
    <section className="bg-white section">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-[var(--primary)] mb-8">
          Aviso legal
        </h1>

        <p className="mb-6">
          En cumplimiento de lo dispuesto en la normativa vigente, se informa a
          los usuarios del presente sitio web de los siguientes datos:
        </p>

        <ul className="space-y-4 list-disc pl-6">
          <li>
            <strong>Titular:</strong> MIGRARIA EXTRANJERÍA
          </li>
          <li>
            <strong>Actividad:</strong> Asesoramiento jurídico en materia de
            extranjería, inmigración y nacionalidad.
          </li>
          <li>
            <strong>Domicilio profesional:</strong> [DIRECCIÓN COMPLETA]
          </li>
          <li>
            <strong>Correo electrónico:</strong> [EMAIL DE CONTACTO]
          </li>
          <li>
            <strong>Teléfono:</strong> [TELÉFONO]
          </li>
          <li>
            <strong>CIF/NIF:</strong> [NÚMERO]
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Condiciones de uso
        </h2>

        <p className="mb-4">
          El acceso y uso de este sitio web atribuye la condición de usuario e
          implica la aceptación plena de las presentes condiciones.
        </p>

        <p className="mb-4">
          El titular se reserva el derecho a modificar en cualquier momento el
          contenido del sitio web, así como las presentes condiciones, sin
          necesidad de previo aviso.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-4">
          Responsabilidad
        </h2>

        <p>
          La información contenida en este sitio web tiene carácter meramente
          informativo y no constituye asesoramiento jurídico. El titular no se
          responsabiliza del uso que los usuarios realicen de la información
          contenida en la web.
        </p>
      </div>
    </section>
  );
}
