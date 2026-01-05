type PortalStatus =
  | "pending"
  | "in_review"
  | "favorable"
  | "not_favorable";

export default function NextSteps({
  status,
}: {
  status: PortalStatus;
}) {
  if (status === "pending") {
    return null;
  }

  if (status === "in_review") {
    return (
      <div className="mt-8 border rounded-lg p-6 bg-gray-50">
        <h3 className="font-medium mb-2">
          ¿Qué ocurre ahora?
        </h3>
        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          <li>Revisamos la documentación aportada</li>
          <li>Evaluamos la viabilidad legal</li>
          <li>
            Te informamos del resultado en este mismo espacio
          </li>
        </ul>
      </div>
    );
  }

  if (status === "favorable") {
    return (
      <div className="mt-8 border rounded-lg p-6 bg-gray-50">
        <h3 className="font-medium mb-2">
          Siguiente paso recomendado
        </h3>
        <p className="text-sm text-gray-700">
          Solicita una cita para iniciar el trámite formal con nuestro equipo.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 border rounded-lg p-6 bg-gray-50">
      <h3 className="font-medium mb-2">
        Recomendación
      </h3>
      <p className="text-sm text-gray-700">
        Podemos estudiar alternativas legales adaptadas a tu situación concreta.
      </p>
    </div>
  );
}
