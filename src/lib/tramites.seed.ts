export const TRAMITES_SEED = [
  {
    key: "arraigo_social",
    label: "Arraigo Social",
    description:
      "Regularización por circunstancias excepcionales para personas que acrediten permanencia en España y vínculos familiares o integración social.",
    documents: [
      "Pasaporte completo",
      "Empadronamiento y pruebas de permanencia",
      "Vínculos familiares y/o informe de integración",
      "Medios económicos / oferta laboral",
    ],
  },

  {
    key: "arraigo_sociolaboral",
    label: "Arraigo Sociolaboral",
    description:
      "Autorización para personas que llevan un tiempo mínimo en España y cuentan con uno o varios contratos de trabajo.",
    documents: [
      "Pasaporte",
      "Empadronamiento",
      "Pruebas de permanencia",
      "Contrato(s) de trabajo",
      "Documentación de la empresa",
      "Soportes económicos adicionales",
    ],
  },

  {
    key: "arraigo_socioformativo",
    label: "Arraigo Socioformativo",
    description:
      "Autorización basada en compromiso de formación, incluida formación promovida por servicios públicos.",
    documents: [
      "Pasaporte",
      "Empadronamiento",
      "Pruebas de permanencia",
      "Admisión, matrícula o compromiso de formación",
      "Informe de integración social",
    ],
  },

  {
    key: "arraigo_familiar",
    label: "Arraigo Familiar",
    description:
      "Autorización por vínculo familiar en supuestos previstos legalmente.",
    documents: [
      "Pasaporte",
      "Certificados de vínculo familiar",
      "Empadronamiento conjunto",
      "Prueba de convivencia o dependencia",
      "Resoluciones judiciales o acuerdos",
    ],
  },

  {
    key: "arraigo_segunda_oportunidad",
    label: "Arraigo de Segunda Oportunidad",
    description:
      "Para personas que tuvieron autorización previa y no pudieron renovarla o prorrogarla.",
    documents: [
      "Resoluciones antiguas",
      "TIE anteriores",
      "Empadronamiento",
      "Pruebas de permanencia",
      "Medios actuales",
      "Documentación de integración",
    ],
  },

  {
    key: "reagrupacion_familiar",
    label: "Reagrupación Familiar",
    description:
      "Autorización para reagrupar familiares por parte de un residente legal en España.",
    documents: [
      "TIE del reagrupante",
      "Medios económicos del reagrupante",
      "Acreditación de vivienda adecuada",
      "Pasaporte del familiar",
      "Documentación de vínculo legalizada o traducida",
    ],
  },

  {
    key: "residencia_cuenta_ajena",
    label: "Residencia y trabajo por cuenta ajena",
    description:
      "Autorización inicial de residencia y trabajo con contrato y expediente completo.",
    documents: [
      "Contrato de trabajo",
      "Documentación de la empresa",
      "Pasaporte del trabajador",
      "Cualificación profesional",
      "Soportes económicos y legales",
    ],
  },

  {
    key: "residencia_cuenta_propia",
    label: "Residencia y trabajo por cuenta propia",
    description:
      "Autorización para emprender como autónomo o profesional con proyecto viable.",
    documents: [
      "Memoria o proyecto",
      "Estudio de viabilidad",
      "Medios económicos",
      "Licencias o trámites sectoriales",
      "Pasaporte",
    ],
  },

  {
    key: "estancia_estudios",
    label: "Estancia por estudios",
    description:
      "Tramitación de estancia por estudios, renovaciones y modificaciones.",
    documents: [
      "Matrícula o admisión",
      "Programa de estudios",
      "Medios económicos",
      "Seguro médico",
      "Pasaporte",
    ],
  },

  {
    key: "residencia_no_lucrativa",
    label: "Residencia no lucrativa",
    description:
      "Residencia sin actividad laboral acreditando medios económicos y seguro médico.",
    documents: [
      "Medios económicos",
      "Seguro médico privado",
      "Antecedentes penales",
      "Documentación personal",
      "Pasaporte",
    ],
  },

  {
    key: "familiar_espanol",
    label: "Residencia de familiar de españoles",
    description:
      "Autorización para familiares de personas con nacionalidad española.",
    documents: [
      "DNI del ciudadano español",
      "Documentación de vínculo familiar",
      "Prueba de convivencia o dependencia",
      "Pasaporte del familiar",
    ],
  },

  {
    key: "larga_duracion",
    label: "Larga duración",
    description:
      "Autorización para residir y trabajar indefinidamente tras cumplir requisitos legales.",
    documents: [
      "Historial de residencias",
      "TIE anteriores",
      "Pasaporte",
      "Empadronamiento",
      "Justificación de ausencias",
    ],
  },

  {
    key: "larga_duracion_ue",
    label: "Larga duración UE",
    description:
      "Autorización de larga duración con efectos en la Unión Europea.",
    documents: [
      "Historial de residencias en la UE",
      "Medios económicos o seguro",
      "Pasaporte",
      "Empadronamiento",
    ],
  },

  {
    key: "razones_humanitarias",
    label: "Razones humanitarias",
    description:
      "Residencia por circunstancias excepcionales por razones humanitarias.",
    documents: [
      "Informes y pruebas humanitarias",
      "Pasaporte",
      "Empadronamiento",
      "Documentación adicional según el caso",
    ],
  },

  {
    key: "asilo_politico",
    label: "Asilo político / protección internacional",
    description:
      "Asistencia en la solicitud de protección internacional y recursos.",
    documents: [
      "Documento de identidad o pasaporte",
      "Relato y cronología",
      "Pruebas documentales",
      "Información contextual del país de origen",
    ],
  },

  {
    key: "busqueda_empleo",
    label: "Búsqueda de empleo / inicio de proyecto empresarial",
    description:
      "Autorización para buscar empleo o iniciar proyecto tras finalizar estudios.",
    documents: [
      "Título o acreditación de estudios finalizados",
      "Medios económicos",
      "Seguro médico",
      "Pasaporte",
    ],
  },

  {
    key: "colaboracion_autoridades",
    label: "Colaboración con autoridades",
    description:
      "Residencia vinculada a colaboración con autoridades competentes.",
    documents: [
      "Informes o soportes de la autoridad competente",
      "Pasaporte",
      "Empadronamiento",
      "Pruebas del caso",
    ],
  },

  {
    key: "emprendedores_uge",
    label: "Emprendedores (Ley 14/2013 - UGE)",
    description:
      "Autorización para actividad emprendedora innovadora de interés económico.",
    documents: [
      "Plan de negocio",
      "Informe favorable",
      "Perfil profesional",
      "Medios económicos",
      "Documentación personal",
    ],
  },

  {
    key: "pac_altamente_cualificados",
    label: "PAC altamente cualificados (Ley 14/2013 - UGE)",
    description:
      "Autorización para directivos o perfiles de alta cualificación.",
    documents: [
      "Oferta o contrato",
      "CV",
      "Titulación o experiencia",
      "Documentación de la empresa",
    ],
  },

  {
    key: "investigadores_uge",
    label: "Investigadores (Ley 14/2013 - UGE)",
    description:
      "Autorización para actividades de investigación, desarrollo e innovación.",
    documents: [
      "Carta u oferta de entidad de investigación",
      "Proyecto o funciones",
      "Documentación personal",
    ],
  },

  {
    key: "ict_movilidad",
    label: "Movilidad intraempresarial ICT (Ley 14/2013 - UGE)",
    description:
      "Traslado temporal dentro de un grupo empresarial.",
    documents: [
      "Carta de desplazamiento",
      "Condiciones laborales",
      "Prueba de vínculo empresa-grupo",
      "Documentación personal",
    ],
  },

  {
    key: "sector_audiovisual",
    label: "Sector audiovisual y cultural (UGE)",
    description:
      "Autorización para profesionales del sector audiovisual y cultural.",
    documents: [
      "Contrato o producción",
      "Calendario",
      "Rol profesional",
      "Acreditación",
      "Documentación personal",
    ],
  },

  {
    key: "nomadas_digitales",
    label: "Nómadas digitales (teletrabajador internacional - UGE)",
    description:
      "Autorización para trabajar a distancia desde España para empresas extranjeras.",
    documents: [
      "Contrato laboral o mercantil",
      "Autorización de la empresa",
      "Medios económicos",
      "Seguro médico",
      "Seguridad social",
      "Pasaporte",
    ],
  },
];
