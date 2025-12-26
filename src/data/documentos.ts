export type Documento = {
  id: string;
  label: string;
  required: boolean;
};

export const documentosPorTramite: Record<string, Documento[]> = {
  "Arraigo social": [
    { id: "pasaporte", label: "Pasaporte completo", required: true },
    { id: "empadronamiento", label: "Certificado de empadronamiento", required: true },
    { id: "oferta_trabajo", label: "Oferta de trabajo", required: true },
  ],
};
