export interface NavLink {
  href: string;
  label: string;
}

export type IconName =
  | "form"
  | "screen"
  | "building"
  | "fees"
  | "contract"
  | "seal"
  | "signature"
  | "house";

export interface QuickTask {
  title: string;
  detail: string;
  href: string;
  icon: IconName;
  external?: boolean;
}

export interface DocumentStep {
  title: string;
  body: string;
}

export interface ServiceCard {
  title: string;
  description: string;
  icon?: IconName;
}

export interface FeatureBlock {
  title: string;
  description: string;
  requiredDocuments?: string[];
  email?: { address: string; subject: string; label: string };
}

export interface FeatureGroup {
  eyebrow: string;
  items: FeatureBlock[];
}

export interface FuncionariosGroup {
  title: string;
  members: string[];
}

export interface FuncionariosSalaryRow {
  rut: string;
  baseSalary: string;
}

export interface FuncionariosSalaryModal {
  buttonLabel: string;
  title: string;
  closeLabel: string;
  rutHeader: string;
  baseSalaryHeader: string;
  variableSalaryHeader: string;
  variableSalaryText: string;
  rows: FuncionariosSalaryRow[];
}

export interface ArancelDocument {
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface TimelineEntry {
  title: string;
  description: string;
  date: string;
  link?: { href: string; label: string };
}

export interface DocumentDownload {
  title: string;
  description: string;
  href: string;
}

export interface VisitDocument {
  title: string;
  description: string;
  href: string;
  label: string;
  /** ISO date (YYYY-MM-DD) of the last PDF replacement; shown as "Actualizado al …". */
  updatedAt?: string;
}

export interface ContactInfo {
  heading: string;
  legalName: string;
  street: string;
  city: string;
  mapsUrl: string;
  locationNote: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  schedule: { weekdays: string; saturdays: string };
  deeds: { heading: string; text: string; email: string };
}

export interface PrivacyListItem {
  html: string;
}

export type PrivacyBlock =
  | { type: "p"; html: string }
  | { type: "list"; items: PrivacyListItem[] };

export interface PrivacyPolicyContent {
  heading: string;
  updatedLabel: string;
  updatedAt: string;
  backLabel: string;
  intro: PrivacyBlock[];
  sections: { heading: string; blocks: PrivacyBlock[] }[];
}

export interface ContactFormContent {
  heading: string;
  consentBefore: string;
  consentLinkLabel: string;
  consentRequiredMessage: string;
  lead: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  phoneNote: string;
  claimTypeLabel: string;
  claimTypePlaceholder: string;
  claimTypes: string[];
  messageLabel: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
}

export interface ConsultaContent {
  eyebrow: string;
  privacyLinkLabel: string;
  heading: string;
  lead: string;
  typeLabel: string;
  types: { escrituras: string; comercio: string };
  repertorioLabel: string;
  numeroProtocolizadoLabel: string;
  privacySummary: string;
  comparecientesLabel: string;
  privacyNote: string;
  submitLabel: string;
  loadingLabel: string;
  loadingMessage: string;
  requiredMessage: string;
  maxLengthMessage: string;
  emptyMessage: string;
  invalidRequestMessage: string;
  unauthorizedMessage: string;
  rateLimitMessage: string;
  timeoutMessage: string;
  errorMessage: string;
  singleResultMessage: string;
  multipleResultsMessage: string;
}

export interface AnnouncementModal {
  id: string;
  title: string;
  body: string;
  closeLabel: string;
  activeUntil: string;
}

// Public bucket where notIA's monthly job publishes the current-year Índice PDFs and manifest.json.
export const INDICES_BUCKET_URL =
  "https://storage.googleapis.com/notia-indices-publicos";

export const site = {
  brand: "Notaría Martínez",
  tagline: "Notario y Conservador de Comercio de Melipilla",
  url: "https://notariamelipilla.cl",

  announcement: {
    id: "aviso-17-septiembre-2026",
    title: "Aviso importante",
    body: "Horario de atención el día 17 de septiembre será de forma excepcional desde las 8:00 hasta las 15:00 hrs.",
    closeLabel: "Cerrar",
    activeUntil: "2026-09-17",
  } satisfies AnnouncementModal,

  nav: [
    { href: "#servicios", label: "Servicios" },
    { href: "#documentos", label: "Documentos" },
    { href: "#consulta", label: "Consulta" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#contacto", label: "Contactos" },
    { href: "#calendario", label: "Calendario" },
  ] satisfies NavLink[],

  hero: {
    heading: "Notaría y Conservador de Comercio en Melipilla",
    lead: "Contratos, certificados, autorizaciones, cartas de poder y compraventas. Sociedades, mandatos, modificaciones y ampliaciones.",
    ctaPrimaryLabel: "Ver servicios",
    ctaSecondaryLabel: "Contactar",
    tasksAriaLabel: "Trámites frecuentes",
    tasks: [
      {
        title: "Formularios para completar",
        detail: "Autorizaciones, carta de poder y declaraciones",
        href: "#documentos",
        icon: "form",
      },
      {
        title: "Copia digital en Fojas.cl",
        detail: "Con su número de certificado",
        href: "https://www.fojas.cl",
        icon: "screen",
        external: true,
      },
      {
        title: "Inscribir una sociedad",
        detail: "Extracto y escritura pública por correo",
        href: "#servicios",
        icon: "building",
      },
      {
        title: "Aranceles oficiales",
        detail: "Arancel 2023 y Decretos Exentos N° 587 y 588",
        href: "#aranceles",
        icon: "fees",
      },
    ] satisfies QuickTask[],
  },

  services: {
    heading: "Trámites notariales con respaldo y experiencia",
    lead: "Atención personalizada en escrituras públicas, instrumentos privados y trámites del Conservador de Comercio.",
    areaTabs: {
      ariaLabel: "Área de servicio",
      notaria: "Notaría",
      conservador: "Conservador de Comercio",
    },
    primary: [
      {
        title: "Contratos",
        description:
          "Testamentos, herencias, actas, constitución de sociedades mercantiles, protestos, reclamación de deudas y capitulaciones matrimoniales.",
        icon: "contract",
      },
      {
        title: "Certificados",
        description:
          "Certificación de documentos, estado civil, inscripción y subinscripción en el Conservador, certificados de gravámenes.",
        icon: "seal",
      },
      {
        title: "Cartas de poder",
        description:
          "Autorización notarial simple para retirar o depositar dinero en cuentas bancarias, cobrar pensiones y solicitar saldos.",
        icon: "signature",
      },
      {
        title: "Compraventas",
        description:
          "Promesas y contratos de compraventa de vehículos motorizados, bienes raíces y bienes muebles.",
        icon: "house",
      },
    ] satisfies ServiceCard[],

    notary: {
      label: "Notario titular",
      name: "René A. Martínez Loaiza",
      role: "Notario y Conservador de Comercio",
      substituteLabel: "Notarios suplentes",
      substituteNotaries: [
        "Jose Mellado Ramirez",
        "Juan Pablo Cerda Torrejón",
        "Alfredo Domke Zepeda",
      ],
      prosecutor: {
        label: "Fiscal",
        name: "Anamaría del Pilar Quintero Harvey",
        office: "Cuarta Fiscalía de la Corte de Apelaciones de San Miguel",
      },
      decree: {
        text: "Nombramiento del Ministerio de Justicia según decreto N° 118 con fecha 22 de febrero de 2012",
        href: "http://transparencia.minjusticia.gob.cl/justicia/2012/efectos_terceros/archivos/Dto.%20118-%202012.pdf",
        label: "Ver decreto",
      },
    },

    secondary: {
      instrumentos: {
        eyebrow: "Instrumentos notariales",
        items: [
          {
            title: "Escrituras públicas",
            description:
              "Instrumento público otorgado con las solemnidades que fija la ley, por el competente notario, e incorporado en su protocolo o registro público.",
          },
          {
            title: "Documentos privados",
            description:
              "Instrumentos privados que las partes otorgantes suscriben en el oficio y retiran para los fines que han sido otorgados.",
          },
        ],
      },
      conservador: {
        eyebrow: "Conservador de Comercio",
        items: [
          {
            title: "Constitución de sociedad",
            description:
              "Inscribimos su sociedad en el Registro de Comercio de Melipilla una vez emitido el extracto de la escritura de constitución. Envíe los documentos requeridos al correo conservadordecomercio@notariamelipilla.cl",
            requiredDocuments: ["Extracto", "Escritura Pública"],
            email: {
              address: "conservadordecomercio@notariamelipilla.cl",
              subject: "Solicitud de constitución de sociedad",
              label: "Enviar solicitud por correo",
            },
          },
          {
            title: "Modificaciones",
            description:
              "Cambios en el objeto social, capital, socios o representante legal, y rectificación de información societaria.",
          },
        ],
      },
    } satisfies Record<"instrumentos" | "conservador", FeatureGroup>,
  },

  funcionarios: {
    heading: "Nuestros funcionarios",
    groups: [
      {
        title: "Instrumentos privados y escrituras públicas",
        members: [
          "Ingrid Vitalia Catalán",
          "Karen Patricia Quintanilla Méndez",
          "Patricia del Pilar Quintanilla",
          "Ariana Elizabeth López López",
          "Luz Abigail Reyes Puchi",
        ],
      },
      {
        title: "Escrituras públicas y registro de comercio",
        members: [
          "Nancy de las Mercedes Martínez Rojas",
          "María Loreto Mondaca Castañeda",
        ],
      },
      {
        title: "Mantención y aseo",
        members: ["Aída del Carmen Salinas Devia"],
      },
    ] satisfies FuncionariosGroup[],
    salaryModal: {
      buttonLabel: "Ver RUT y sueldo base",
      title: "RUT y sueldo base de funcionarios",
      closeLabel: "Cerrar",
      rutHeader: "RUT",
      baseSalaryHeader: "Sueldo Base",
      variableSalaryHeader: "Sueldo variable",
      variableSalaryText: "más monto variable calculado cada mes",
      rows: [
        { rut: "XX.XXX.389-K", baseSalary: "$ 553.553" },
        { rut: "XX.XXX.387-1", baseSalary: "$ 553.553" },
        { rut: "XX.XXX.234-0", baseSalary: "$ 553.553" },
        { rut: "XX.XXX.325-K", baseSalary: "$ 553.553" },
        { rut: "XX.XXX.067-0", baseSalary: "$ 553.553" },
        { rut: "XX.XXX.309-9", baseSalary: "$ 553.553" },
        { rut: "XX.XXX.648-2", baseSalary: "$ 553.553" },
        { rut: "XX.XXX.540-1", baseSalary: "$ 553.553" },
      ],
    } satisfies FuncionariosSalaryModal,
  },

  aranceles: {
    fileTypeLabel: "PDF",
    heading: "Aranceles",
    disclaimer:
      "Los aranceles publicados corresponden a los documentos oficiales disponibles en PDF.",
    documents: [
      {
        title: "Arancel notarial actualizado a diciembre de 2023",
        description:
          "Documento con los valores actualizados de precios notariales, publicado como referencia principal para consulta del público.",
        href: "/docs/arancel-notarios-actualizado-diciembre-2023.pdf",
        label: "Ver PDF de precios actualizados",
      },
      {
        title: "Decreto Exento N° 587",
        description:
          "Texto del decreto exento que regula el arancel de notarios y sirve como respaldo normativo del arancel publicado.",
        href: "/docs/decreto-exento-587.pdf",
        label: "Ver PDF del Decreto Exento N° 587",
      },
      {
        title: "Decreto Exento N° 588",
        description:
          "Texto del decreto exento aplicable al arancel de conservadores, disponible como respaldo documental complementario.",
        href: "/docs/decreto-exento-588.pdf",
        label: "Ver PDF del Decreto Exento N° 588",
      },
    ] satisfies ArancelDocument[],
  },

  about: {
    section: {
      heading: "Quiénes somos",
    },
    commitment: {
      body: "La satisfacción de nuestros clientes es lo más importante para nosotros. Nuestro compromiso es ofrecer a cada persona un servicio que cumpla y supere sus expectativas, con atención personalizada y la mejor disposición a su servicio.",
    },

    trajectory: {
      ariaLabel: "Historia y trayectoria",
    },

    timeline: [
      {
        title: "Inicios profesionales",
        description:
          "Comienzo de la trayectoria profesional de René Martínez Loaiza en el ámbito notarial.",
        date: "Abril 2003",
      },
      {
        title: "Nombramiento del Ministerio de Justicia",
        description:
          "El Ministerio de Justicia nombra a Don René Martínez Loaiza en el cargo de Notario de Melipilla.",
        date: "Febrero 2012",
        link: {
          href: "http://transparencia.minjusticia.gob.cl/justicia/2012/efectos_terceros/archivos/Dto.%20118-%202012.pdf",
          label: "Decreto N° 118",
        },
      },
      {
        title: "Instalaciones y servicios",
        description:
          "Apertura en pleno centro de Melipilla, Avenida Serrano 369, oficina 11, a media cuadra de la Plaza de Armas.",
        date: "Marzo 2012",
      },
      {
        title: "Experiencia y profesionalismo",
        description:
          "La experiencia adquirida desde el inicio de nuestras actividades nos permite mejorar continuamente nuestros servicios e instalaciones, incorporando nuevas tecnologías para mejorar la atención.",
        date: "Hoy",
      },
    ] satisfies TimelineEntry[],
  },

  documents: {
    downloadCtaLabel: "Completar en línea",
    heading: "Documentos online e información",
    lead: "Haga clic en el documento que necesita, complételo en línea con sus datos, descárguelo e imprímalo. Todo documento debe ser firmado por el interesado ante el notario.",
    steps: [
      {
        title: "Complete el formulario",
        body: "Abra el documento y seleccione “Completar en línea”.",
      },
      {
        title: "Descargue e imprima",
        body: "Genere el PDF con sus datos, descárguelo e imprímalo. Sus datos no se guardan.",
      },
      {
        title: "Firme ante notario",
        body: "Concurra personalmente con cédula de identidad o pasaporte vigente.",
      },
    ] satisfies DocumentStep[],
    downloads: [
      {
        title: "Autorización trabajo menor de edad",
        description:
          "La concurrencia personal del interesado, con cédula de identidad o pasaporte vigente, es requisito esencial para autorizar instrumentos en este oficio.",
        href: "/documentos/#autorizacion-trabajo-menor",
      },
      {
        title: "Autorización viaje menor de edad",
        description:
          "Solicitud notarial necesaria para que un menor de edad pueda viajar dentro o fuera del país sin la compañía de sus padres.",
        href: "/documentos/#autorizacion-viaje-menor",
      },
      {
        title: "Carta de poder",
        description:
          "Instrumento que faculta a una persona para actuar en nombre de otra en trámites y gestiones específicas.",
        href: "/documentos/#carta-poder",
      },
      {
        title: "Declaración jurada",
        description:
          "Documento en el que el otorgante declara, bajo juramento, hechos que pueden ser usados como prueba legal.",
        href: "/documentos/#declaracion-jurada",
      },
      {
        title: "Declaración Ley de Alcoholes",
        description:
          "Declaración requerida para actos relacionados con establecimientos de expendio de bebidas alcohólicas. Complete el documento antes de acudir al oficio.",
        href: "/documentos/#declaracion-ley-alcoholes",
      },
    ] satisfies DocumentDownload[],

    fojas: {
      eyebrow: "Portal Fojas",
      heading: "Copias digitales online",
      body: "Obtenga una copia digital de sus documentos tramitados en nuestra notaría a través del Portal Fojas.cl. Seleccione “Notaría René Alejandro Martínez Loaiza” e ingrese su número de certificado.",
      ctaLabel: "Ir a Fojas.cl",
      href: "https://www.fojas.cl",
    },
  },

  transparencia: {
    eyebrow: "Fiscalización",
    heading: "Transparencia y visitas notariales",
    salaryCardLabel: "RUT y sueldo base de funcionarios",
    salaryCardAction: "Ver",
    updatedAtLabel: "Actualizado al",
    indicesManifestUrl: `${INDICES_BUCKET_URL}/manifest.json`,
    lead: "Auditorías de rutina o extraordinarias destinadas a fiscalizar el correcto funcionamiento de la notaría, revisar protocolos y libros de registros, y resguardar los estándares de fe pública.",
    documents: [
      {
        title: "Visita 2025 · 4° bimestre",
        description:
          "Acta de visita correspondiente al cuarto bimestre de 2025 para Notaría Martínez y Conservador de Comercio.",
        href: "/docs/visitas/visita-notaria-martinez-2025-4to-bimestre.pdf",
        label: "Ver PDF 4° bimestre",
      },
      {
        title: "Visita 2025 · 5° bimestre",
        description:
          "Acta de visita correspondiente al quinto bimestre de 2025 para Notaría Martínez y Conservador de Comercio.",
        href: "/docs/visitas/visita-notaria-martinez-2025-5to-bimestre.pdf",
        label: "Ver PDF 5° bimestre",
      },
      {
        title: "Visita 2025 · 6° bimestre",
        description:
          "Acta de visita correspondiente al sexto bimestre de 2025 para Notaría Martínez y Conservador de Comercio.",
        href: "/docs/visitas/visita-notaria-martinez-2025-6to-bimestre.pdf",
        label: "Ver PDF 6° bimestre",
      },
      {
        title: "Balance general 2025",
        description:
          "Balance general anual de Notaría Martínez, disponible para consulta pública.",
        href: "/docs/balance-general-notaria-at-2025.pdf",
        label: "Ver balance general",
      },
      {
        title: "Índice Registro de Comercio 2024",
        description:
          "Índice anual del Registro de Comercio de Melipilla correspondiente a 2024, con las inscripciones de constituciones, modificaciones y actas.",
        href: "/docs/comercio/ind-com-2024.pdf",
        label: "Ver índice 2024",
        updatedAt: "2026-06-12",
      },
      {
        title: "Índice Registro de Comercio 2025",
        description:
          "Índice anual del Registro de Comercio de Melipilla correspondiente a 2025, con las inscripciones de constituciones, modificaciones y actas.",
        href: "/docs/comercio/ind-com-2025.pdf",
        label: "Ver índice 2025",
        updatedAt: "2026-06-15",
      },
      {
        title: "Índice Registro de Comercio 2026",
        description:
          "Índice anual del Registro de Comercio de Melipilla correspondiente a 2026, con las inscripciones de constituciones, modificaciones y actas.",
        href: "/docs/comercio/ind-com-2026.pdf",
        label: "Ver índice 2026",
        updatedAt: "2026-10-23",
      },
      {
        title: "Índice de Instrumentos Públicos 2026",
        description:
          "Índice de instrumentos públicos de Notaría Martínez correspondiente a 2026, disponible para consulta pública.",
        href: "/docs/instrumentos-publicos-2026.pdf",
        label: "Ver índice de instrumentos públicos",
        updatedAt: "2026-10-28",
      },
      {
        title: "Repertorio de Instrumentos Protocolizados 2026",
        description:
          "Repertorio de Instrumentos Protocolizados de Notaría Martínez correspondiente a 2026, disponible para consulta pública.",
        href: "/docs/instrumentos-protocolizados-2026.pdf",
        label: "Ver repertorio de protocolizaciones",
        updatedAt: "2026-07-10",
      },
    ] satisfies VisitDocument[],
  },

  consulta: {
    eyebrow: "Consulta en línea",
    heading: "Consulta de escrituras",
    lead: "Busque una escritura pública o una inscripción de comercio por su número de repertorio.",
    typeLabel: "Tipo de repertorio",
    types: {
      escrituras: "Escrituras públicas",
      comercio: "Comercio",
    },
    repertorioLabel: "N° de repertorio",
    numeroProtocolizadoLabel: "N° protocolizado",
    privacySummary: "Protección de datos personales",
    comparecientesLabel: "Comparecientes",
    privacyNote:
      "Por protección de datos personales (Ley 19.628 y Ley 21.719), la consulta muestra únicamente datos identificatorios limitados de los comparecientes: primer nombre y apellido paterno para personas naturales, o razón social para personas jurídicas.",
    privacyLinkLabel: "Ver la Política de privacidad",
    submitLabel: "Consultar",
    loadingLabel: "Consultando…",
    loadingMessage: "Buscando resultados…",
    requiredMessage: "Ingrese un número de repertorio.",
    maxLengthMessage: "El número de repertorio no puede superar 30 caracteres.",
    emptyMessage: "No se encontraron resultados para ese número de repertorio.",
    invalidRequestMessage: "Revise los datos ingresados e intente nuevamente.",
    unauthorizedMessage:
      "No pudimos verificar la solicitud. Recargue la página e intente nuevamente.",
    rateLimitMessage:
      "Demasiadas consultas. Intente nuevamente en unos minutos.",
    timeoutMessage: "La consulta tardó demasiado. Intente nuevamente.",
    errorMessage:
      "No fue posible realizar la consulta. Intente nuevamente más tarde.",
    singleResultMessage: "Se encontró 1 resultado.",
    multipleResultsMessage: "Se encontraron {count} resultados.",
  } satisfies ConsultaContent,

  contactForm: {
    heading: "Ingrese un reclamo",
    lead: "Complete el formulario. Su reclamo será atendido a la brevedad.",
    nameLabel: "Nombre completo",
    emailLabel: "Correo electrónico",
    phoneLabel: "Teléfono",
    phoneNote: "(opcional)",
    claimTypeLabel: "Tipo de reclamo",
    claimTypePlaceholder: "— Seleccione —",
    claimTypes: [
      "Demora en trámite",
      "Cobros / honorarios",
      "Atención al cliente",
      "Error en documento",
      "Otro",
    ],
    messageLabel: "Descripción del reclamo",
    consentBefore: "He leído y acepto la",
    consentLinkLabel: "Política de privacidad",
    consentRequiredMessage:
      "Para enviar el reclamo debe aceptar la Política de privacidad.",
    submitLabel: "Enviar reclamo",
    sendingLabel: "Enviando…",
    successMessage: "Reclamo recibido. Lo atenderemos a la brevedad.",
    errorMessage:
      "No fue posible enviar el reclamo. Intente nuevamente o contáctenos por teléfono.",
  } satisfies ContactFormContent,

  contact: {
    heading: "Contactos",
    legalName: "Notaría René A. Martínez Loaiza",
    street: "Avenida Serrano 369, oficina 11",
    city: "Melipilla, Chile",
    locationNote:
      "En pleno centro de Melipilla, al costado del mall Melipilla.",
    mapsUrl:
      "https://www.google.com/maps?q=Avenida+Serrano+369,+Melipilla,+Chile",
    phoneDisplay: "(+56 2) 3314 8818",
    phoneE164: "+56233148818",
    email: "notaria.martinez@gmail.com",
    schedule: {
      weekdays: "Lunes a viernes · 09:00 a 17:00",
      saturdays: "Sábados · 09:30 a 12:45",
    },
    deeds: {
      heading: "¿Quiere redactar o suscribir su escritura?",
      text: "Si necesita redactar una escritura pública o no cuenta con asesoría para hacerlo, escríbanos y lo orientaremos.",
      email: "escrituraspublicas@notariamelipilla.cl",
    },
  } satisfies ContactInfo,

  calendar: {
    eyebrow: "Calendario",
    heading: "Calendario de atención",
    lead: "Días y horarios de atención publicados por la notaría. Disponibilidad actualizada en tiempo real.",
    loadingLabel: "Cargando calendario…",
    todayLabel: "Hoy",
    errorMessage: "No fue posible cargar el calendario. Intente más tarde.",
    eventLabels: {
      attention: "Atención",
      holidayFallback: "Feriado",
    },
    reservationNote: {
      beforePhone: "Horarios sujetos a confirmación. Contáctenos al",
      afterPhone: "para reservar.",
    },
  },

  privacyPolicy: {
    heading: "Política de privacidad",
    updatedLabel: "Última actualización:",
    updatedAt: "27 de noviembre de 2026",
    backLabel: "Volver al inicio",
    intro: [
      {
        type: "p",
        html: "Esta política explica qué datos personales trata la Notaría a través de este sitio web y del registro notarial, para qué los usa y cómo puede ejercer sus derechos.",
      },
    ],
    sections: [
      {
        heading: "1. Responsable",
        blocks: [
          {
            type: "p",
            html: "El responsable del tratamiento es el Notario René A. Martínez Loaiza, Notario y Conservador de Comercio de Melipilla, con oficio en Avenida Serrano 369, oficina 11, Melipilla.",
          },
          {
            type: "p",
            html: "Correo electrónico de contacto: notaria.martinez@gmail.com.",
          },
        ],
      },
      {
        heading: "2. Normativa aplicable",
        blocks: [
          {
            type: "p",
            html: "El tratamiento de datos personales se rige por la Ley N° 19.628, sobre protección de la vida privada. Desde el 15 de octubre de 2027 se regirá por la Ley N° 21.719, sobre protección de datos personales. La función notarial se rige además por el Código Orgánico de Tribunales.",
          },
        ],
      },
      {
        heading: "3. Datos que se tratan en este sitio",
        blocks: [
          {
            type: "p",
            html: "<strong>a) Formulario de reclamos y consultas.</strong>",
          },
          {
            type: "list",
            items: [
              {
                html: "<strong>Datos que se piden:</strong> nombre, correo electrónico, teléfono (opcional), tipo de reclamo y descripción.",
              },
              {
                html: "<strong>Para qué se usan:</strong> solo para atender y responder su reclamo o consulta.",
              },
              {
                html: "<strong>Cómo se envían:</strong> el formulario se procesa en un servicio de Google Cloud (Firebase) ubicado en Santiago de Chile, que envía los datos por correo electrónico a la casilla de la Notaría en Gmail (Google). El sitio no los guarda en ninguna base de datos.",
              },
              {
                html: "<strong>Cuánto tiempo se conservan:</strong> en el correo de la Notaría, mientras sea necesario para atender el reclamo y cumplir las obligaciones legales de la Notaría.",
              },
              {
                html: "<strong>Su consentimiento:</strong> al enviar el formulario usted acepta este tratamiento. Para enviarlo debe marcar la casilla de aceptación de esta política.",
              },
            ],
          },
          {
            type: "p",
            html: "<strong>b) Consulta pública de escrituras.</strong>",
          },
          {
            type: "list",
            items: [
              {
                html: "<strong>Qué se le pide:</strong> solo el número de repertorio.",
              },
              {
                html: "<strong>Qué muestra:</strong> el número de repertorio, la fecha, la materia, la foja y una identificación limitada de los comparecientes: primer nombre y apellido paterno de las personas naturales, o razón social de las personas jurídicas. Nunca muestra el contenido del documento.",
              },
              {
                html: "<strong>Por qué se publica:</strong> la ley ordena que el repertorio y los índices de escrituras públicas sean públicos y que el notario facilite su examen (Código Orgánico de Tribunales, arts. 401, 401 bis, 430 y 431).",
              },
              {
                html: "<strong>Límite de consultas:</strong> para evitar abusos, la dirección IP de quien consulta se usa temporalmente para limitar el número de consultas por minuto, y se elimina automáticamente en menos de una hora.",
              },
            ],
          },
          {
            type: "p",
            html: "<strong>c) Generador de documentos simples.</strong> Los datos que usted escribe para preparar autorizaciones, poderes o declaraciones se procesan solo en su navegador para generar el documento. No se envían a la Notaría ni se guardan.",
          },
          {
            type: "p",
            html: '<strong>d) Protección contra uso automatizado.</strong> El formulario de reclamos usa reCAPTCHA de Google para distinguir a las personas de los programas automatizados. reCAPTCHA recoge datos técnicos de su dispositivo y navegador, y se rige por la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad</a> y los <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Términos del Servicio</a> de Google.',
          },
          {
            type: "p",
            html: "<strong>e) Sin seguimiento ni publicidad.</strong> El sitio no usa herramientas de analítica ni cookies de publicidad. El navegador solo recuerda si usted cerró un aviso, sin guardar datos personales.",
          },
        ],
      },
      {
        heading: "4. Datos del registro notarial",
        blocks: [
          {
            type: "list",
            items: [
              {
                html: "<strong>Qué datos y para qué:</strong> la Notaría registra los datos de las escrituras públicas y de sus comparecientes para llevar el Repertorio y los Índices que exige la ley. Este tratamiento se hace por mandato legal y no requiere consentimiento (Ley 19.628, art. 4).",
              },
              {
                html: "<strong>Dónde se guardan:</strong> en la infraestructura de Google Cloud en Santiago de Chile. Solo accede personal autorizado de la Notaría, desde su red privada y con credenciales personales. Cada modificación y cada ingreso al sistema quedan registrados.",
              },
            ],
          },
        ],
      },
      {
        heading: "5. Sus derechos",
        blocks: [
          {
            type: "p",
            html: "Usted puede pedir información sobre los datos que la Notaría trata sobre usted, su origen y su destino, y pedir que se corrijan si son erróneos o incompletos. También puede pedir que se eliminen o bloqueen cuando no exista fundamento legal para conservarlos (Ley 19.628, art. 12). Estos derechos son gratuitos.",
          },
          {
            type: "p",
            html: "Los datos que forman parte del protocolo, del repertorio y de los índices no pueden eliminarse, porque la ley obliga al notario a conservarlos (Código Orgánico de Tribunales, arts. 401 N° 7, 429, 430 y 431).",
          },
          {
            type: "p",
            html: "Para ejercer sus derechos, escriba a notaria.martinez@gmail.com o acuda a la Notaría. Puede pedírselo a la Notaría la persona titular de los datos o su representante, acreditando su identidad.",
          },
        ],
      },
      {
        heading: "6. Seguridad",
        blocks: [
          {
            type: "p",
            html: "La Notaría adopta medidas para cuidar los datos con la debida diligencia: acceso restringido y autenticado, registro de cambios y de accesos, y respaldos periódicos.",
          },
        ],
      },
      {
        heading: "7. Cambios a esta política",
        blocks: [
          {
            type: "p",
            html: "Esta política puede actualizarse, por ejemplo cuando entre en vigencia la Ley N° 21.719. La fecha de la última actualización se indica al inicio.",
          },
        ],
      },
    ],
  } satisfies PrivacyPolicyContent,

  footer: {
    privacy: {
      label: "Política de privacidad",
      href: "/privacidad/",
    },
    copyright: `Copyright © ${new Date().getFullYear()} Notaría Martínez · Todos los derechos reservados.`,
    transparency: {
      label: "Declaración de patrimonio e intereses",
      href: "https://www.infoprobidad.cl/Declaracion/Declaracion?ID=5114744",
    },
  },
} as const;

export type Site = typeof site;
