export default function PoliticaCookiesPage() {
  return (
    <section className="bg-white section">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-[var(--primary)] mb-8">
          Política de cookies
        </h1>

        <p className="mb-6">
          Este sitio web utiliza cookies propias y de terceros con la finalidad
          de garantizar el correcto funcionamiento del sitio y mejorar la
          experiencia del usuario.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          ¿Qué son las cookies?
        </h2>

        <p className="mb-4">
          Las cookies son pequeños archivos de texto que se almacenan en el
          dispositivo del usuario cuando visita un sitio web.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Tipos de cookies utilizadas
        </h2>

        <ul className="space-y-3 list-disc pl-6">
          <li>
            <strong>Cookies técnicas:</strong> necesarias para el funcionamiento
            básico del sitio web.
          </li>
          <li>
            <strong>Cookies de terceros:</strong> como las utilizadas por
            herramientas externas (por ejemplo, Calendly).
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Gestión de cookies
        </h2>

        <p>
          El usuario puede configurar su navegador para bloquear o eliminar las
          cookies. La desactivación de cookies puede afectar al correcto
          funcionamiento del sitio web.
        </p>
      </div>
    </section>
  );
}
