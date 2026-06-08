export interface NavLink {
  href: string;
  label: string;
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  caption: string;
  image: string;
  alt: string;
}

export interface ServiceCard {
  title: string;
  description: string;
}

export interface FeatureBlock {
  icon: "newspaper" | "file" | "users" | "eraser" | "stamp";
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
  icon: "gavel" | "university" | "cogs";
  title: string;
  description: string;
  period: string;
  date: string;
  link?: { href: string; label: string };
}

export interface DocumentDownload {
  title: string;
  description: string;
  href: string;
  icon: "check" | "plane" | "bolt" | "bookmark" | "scroll";
}

export interface VisitDocument {
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface ContactInfo {
  legalName: string;
  street: string;
  city: string;
  mapsUrl: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  schedule: { weekdays: string; saturdays: string };
}

export interface ContactFormContent {
  heading: string;
  lead: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  phoneNote: string;
  claimTypeLabel: string;
  claimTypes: string[];
  messageLabel: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
}

export const site = {
  brand: "Notaría Martínez",
  tagline: "Notario y Conservador de Comercio de Melipilla",
  url: "https://notariamelipilla.cl",

  nav: [
    { href: "#servicios", label: "Servicios" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#documentos", label: "Documentos" },
    { href: "#contacto", label: "Contactos" },
    { href: "#calendario", label: "Calendario" },
  ] satisfies NavLink[],

  hero: {
    ctaPrimaryLabel: "Ver servicios",
    ctaSecondaryLabel: "Contactar",
    carouselAriaLabel: "Carrusel de presentación",
    slideAriaLabelPrefix: "Ir al slide",
    slides: [
      {
        title: "Notaría de Melipilla",
        subtitle:
          "Contratos, certificados, autorizaciones, cartas de poder y compraventas.",
        caption:
          "Celebramos documentos públicos y privados con rigor y atención personalizada.",
        image: "/images/header_one.jpg",
        alt: "Fachada de la Notaría Martínez",
      },
      {
        title: "Conservador de Comercio",
        subtitle: "Sociedades, mandatos, modificaciones y ampliaciones.",
        caption:
          "Inscriba, registre y proteja su negocio con el respaldo del Conservador de Comercio.",
        image: "/images/header_two.jpg",
        alt: "Sala de atención de la notaría",
      },
    ] satisfies HeroSlide[],
  },

  services: {
    eyebrow: "Servicios",
    heading: "Trámites notariales con respaldo y experiencia",
    lead: "Atención personalizada en escrituras públicas, instrumentos privados y trámites del Conservador de Comercio.",
    primary: [
      {
        title: "Contratos",
        description:
          "Testamentos, herencias, actas, constitución de sociedades mercantiles, protestos, reclamación de deudas y capitulaciones matrimoniales.",
      },
      {
        title: "Certificados",
        description:
          "Certificación de documentos, estado civil, inscripción y subinscripción en el Conservador, certificados de gravámenes.",
      },
      {
        title: "Cartas de poder",
        description:
          "Autorización notarial simple para retirar o depositar dinero en cuentas bancarias, cobrar pensiones y solicitar saldos.",
      },
      {
        title: "Compraventas",
        description:
          "Promesas y contratos de compraventa de vehículos motorizados, bienes raíces y bienes muebles.",
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
            icon: "newspaper",
            title: "Escrituras públicas",
            description:
              "Instrumento público otorgado con las solemnidades que fija la ley, por el competente notario, e incorporado en su protocolo o registro público.",
          },
          {
            icon: "file",
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
            icon: "users",
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
            icon: "eraser",
            title: "Modificaciones",
            description:
              "Cambios en el objeto social, capital, socios o representante legal, y rectificación de información societaria.",
          },
        ],
      },
    } satisfies Record<"instrumentos" | "conservador", FeatureGroup>,
  },

  funcionarios: {
    eyebrow: "Equipo",
    heading: "Nuestros funcionarios",
    lead: "Profesionales comprometidos con cada trámite.",
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
        { rut: "XX.XXX.389-K", baseSalary: "$ 539.000" },
        { rut: "XX.XXX.387-1", baseSalary: "$ 539.000" },
        { rut: "XX.XXX.234-0", baseSalary: "$ 539.000" },
        { rut: "XX.XXX.325-K", baseSalary: "$ 539.000" },
        { rut: "XX.XXX.067-0", baseSalary: "$ 539.000" },
        { rut: "XX.XXX.309-9", baseSalary: "$ 552.280" },
        { rut: "XX.XXX.648-2", baseSalary: "$ 539.000" },
        { rut: "XX.XXX.540-1", baseSalary: "$ 539.000" },
      ],
    } satisfies FuncionariosSalaryModal,
  },

  aranceles: {
    eyebrow: "Tarifas",
    heading: "Aranceles",
    lead: "Consulte y descargue los documentos oficiales de aranceles disponibles.",
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
      eyebrow: "Nosotros",
      heading: "Quiénes somos",
      lead: "Conocé nuestra trayectoria, nuestro equipo y el compromiso que nos define.",
    },
    commitment: {
      heading: "Nuestro compromiso",
      lead: "En Notaría Melipilla sabemos que lo más importante son nuestros clientes.",
      title: "Atención personalizada",
      body: "La satisfacción de nuestros clientes es lo más importante para nosotros. Nuestro compromiso es ofrecer a cada persona un servicio que cumpla y supere sus expectativas, con atención personalizada y la mejor disposición a su servicio.",
      image: "/images/compromiso.png",
      imageAlt: "Nuestro compromiso con cada cliente",
    },

    trajectory: {
      heading: "Trayectoria",
      title: "Más de 15 años de experiencia notarial",
      ariaLabel: "Historia y trayectoria",
    },

    timeline: [
      {
        icon: "gavel",
        title: "Inicios profesionales",
        description:
          "Comienzo de la trayectoria profesional de René Martínez Loaiza en el ámbito notarial.",
        period: "Inicios",
        date: "Abril 2003",
      },
      {
        icon: "gavel",
        title: "Nombramiento del Ministerio de Justicia",
        description:
          "El Ministerio de Justicia nombra a Don René Martínez Loaiza en el cargo de Notario de Melipilla.",
        period: "Nombramiento",
        date: "Febrero 2012",
        link: {
          href: "http://transparencia.minjusticia.gob.cl/justicia/2012/efectos_terceros/archivos/Dto.%20118-%202012.pdf",
          label: "Decreto N° 118",
        },
      },
      {
        icon: "university",
        title: "Instalaciones y servicios",
        description:
          "Apertura en pleno centro de Melipilla, Avenida Serrano 369, oficina 11, a media cuadra de la Plaza de Armas.",
        period: "Inicio de actividades",
        date: "Marzo 2012",
      },
      {
        icon: "cogs",
        title: "Experiencia y profesionalismo",
        description:
          "La experiencia adquirida desde el inicio de nuestras actividades nos permite mejorar continuamente nuestros servicios e instalaciones, incorporando nuevas tecnologías para mejorar la atención.",
        period: "Crecimiento y desarrollo",
        date: "Hoy",
      },
    ] satisfies TimelineEntry[],
  },

  documents: {
    eyebrow: "Documentos",
    downloadCtaLabel: "Hacer una copia",
    heading: "Documentos online e información",
    lead: "Haz clic en el documento que necesitas, crea tu copia y complétalo con tus datos e imprímelo. Todo documento debe ser firmado por el interesado ante el notario.",
    downloads: [
      {
        title: "Autorización trabajo menor de edad",
        description:
          "La concurrencia personal del interesado, con cédula de identidad o pasaporte vigente, es requisito esencial para autorizar instrumentos en este oficio.",
        href: "https://docs.google.com/document/d/11oc45ydx-j5emTHNzaKVxnGQmHXjjqd6XcBbJ5walAU/copy",
        icon: "check",
      },
      {
        title: "Autorización viaje menor de edad",
        description:
          "Solicitud notarial necesaria para que un menor de edad pueda viajar dentro o fuera del país sin la compañía de sus padres.",
        href: "https://docs.google.com/document/d/1q3KVDIg7ZuCue7a930jeLbJvyFOH4kwskrG017TMKZg/copy",
        icon: "plane",
      },
      {
        title: "Carta de poder",
        description:
          "Instrumento que faculta a una persona para actuar en nombre de otra en trámites y gestiones específicas.",
        href: "https://docs.google.com/document/d/1o1IS8FolssJEalAruYsqcxWQO4ux4dd-8a5CnXuW0qA/copy",
        icon: "bolt",
      },
      {
        title: "Declaración jurada",
        description:
          "Documento en el que el otorgante declara, bajo juramento, hechos que pueden ser usados como prueba legal.",
        href: "https://docs.google.com/document/d/1anHy5zPvectHTBeR5zkSHO2dZW245La5VusLeuvKygc/copy",
        icon: "bookmark",
      },
      {
        title: "Declaración Ley de Alcoholes",
        description:
          "Declaración requerida para actos relacionados con establecimientos de expendio de bebidas alcohólicas. Complete el documento antes de acudir al oficio.",
        href: "https://docs.google.com/document/d/154XCd61Sj3VuHRkhLtmemJj7FmgVAZUD5IoolbAHaBQ/copy",
        icon: "scroll",
      },
    ] satisfies DocumentDownload[],

    visitas: {
      eyebrow: "Fiscalización",
      heading: "Visitas notariales",
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
      ] satisfies VisitDocument[],
    },

    fojas: {
      eyebrow: "Portal Fojas",
      heading: "Copias digitales online",
      body: "Obtenga una copia digital de sus documentos tramitados en nuestra notaría a través del Portal Fojas.cl. Seleccione “Notaría René Alejandro Martínez Loaiza” e ingrese su número de certificado.",
      ctaLabel: "Ir a Fojas.cl",
      logoAlt: "Logo Fojas.cl",
      href: "https://www.fojas.cl",
      logo: "/images/fojas2.png",
    },
  },

  contactForm: {
    heading: "Ingrese un reclamo",
    lead: "Complete el formulario. Su reclamo será atendido a la brevedad.",
    nameLabel: "Nombre completo",
    emailLabel: "Correo electrónico",
    phoneLabel: "Teléfono",
    phoneNote: "(opcional)",
    claimTypeLabel: "Tipo de reclamo",
    claimTypes: [
      "Demora en trámite",
      "Cobros / honorarios",
      "Atención al cliente",
      "Error en documento",
      "Otro",
    ],
    messageLabel: "Descripción del reclamo",
    submitLabel: "Enviar reclamo",
    sendingLabel: "Enviando…",
    successMessage: "Reclamo recibido. Lo atenderemos a la brevedad.",
    errorMessage:
      "No fue posible enviar el reclamo. Intente nuevamente o contáctenos por teléfono.",
  } satisfies ContactFormContent,

  contact: {
    legalName: "Notaría René A. Martínez Loaiza",
    street: "Avenida Serrano 369, oficina 11",
    city: "Melipilla, Chile",
    mapsUrl:
      "https://www.google.com/maps?q=Avenida+Serrano+369,+Melipilla,+Chile",
    phoneDisplay: "(+56 2) 3314 8818",
    phoneE164: "+56233148818",
    email: "notaria.martinez@gmail.com",
    schedule: {
      weekdays: "Lunes a viernes · 09:00 a 17:00",
      saturdays: "Sábados · 09:30 a 12:45",
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

  footer: {
    copyright: `Copyright © ${new Date().getFullYear()} Notaría Martínez · Todos los derechos reservados.`,
    transparency: {
      label: "Declaración de patrimonio e intereses",
      href: "https://www.infoprobidad.cl/Declaracion/Declaracion?ID=5114744",
    },
  },
} as const;

export type Site = typeof site;
