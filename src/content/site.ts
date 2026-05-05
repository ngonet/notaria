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
  icon: "newspaper" | "file" | "users" | "eraser";
  title: string;
  description: string;
}

export interface FuncionariosGroup {
  title: string;
  members: string[];
}

export interface ArancelItem {
  service: string;
  amount: string;
  note?: string;
}

export interface ArancelArea {
  title: string;
  items: ArancelItem[];
  note?: string;
  source?: { href: string; label: string };
}

export interface ArancelDocument {
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
  icon: "check" | "plane" | "bolt" | "bookmark";
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

export const site = {
  brand: "Notaría Martínez",
  tagline: "Notario y Conservador de Comercio de Melipilla",
  url: "https://notariamelipilla.cl",

  nav: [
    { href: "#servicios", label: "Servicios" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#documentos", label: "Documentos" },
    { href: "#contacto", label: "Contacto" },
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
      name: "René A. Martínez Loaiza",
      role: "Notario y Conservador de Comercio",
      decree: {
        text: "Nombramiento del Ministerio de Justicia según decreto N° 118 con fecha 22 de febrero de 2012",
        href: "http://transparencia.minjusticia.gob.cl/justicia/2012/efectos_terceros/archivos/Dto.%20118-%202012.pdf",
      },
    },

    secondary: [
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
      {
        icon: "users",
        title: "Constitución de sociedad",
        description:
          "Permite inscribirse en el Registro de Comercio del Conservador de Melipilla una vez emitido el extracto de la escritura de constitución.",
      },
      {
        icon: "eraser",
        title: "Modificaciones",
        description:
          "Modificación del objeto social, ingreso o retiro de socios, cambio del representante legal, modificación del capital y rectificación de información.",
      },
    ] satisfies FeatureBlock[],
  },

  funcionarios: {
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
  },

  aranceles: {
    heading: "Aranceles",
    lead: "Valores vigentes para los principales servicios notariales.",
    disclaimer:
      "Aranceles referenciales. Escrituras públicas e instrumentos privados actualizados a diciembre de 2023. Valores del Registro de Bienes Raíces y Comercio actualizados a abril de 2023. Fuentes normativas: Decreto Exento N° 587 y Decreto Exento N° 588 del Ministerio de Justicia.",
    document: {
      href: "/docs/arancel-notarios-actualizado-diciembre-2023.pdf",
      label: "Ver respaldo de arancel notarial actualizado a diciembre de 2023",
    } satisfies ArancelDocument,
    areas: [
      {
        title: "Escrituras públicas",
        note: "Arancel notarial actualizado a diciembre de 2023. Se aplica recargo de 1‰ sobre el monto del acto o contrato (límite $319.232.000).",
        source: {
          href: "https://www.bcn.cl/leychile/navegar?idNorma=129528",
          label: "Decreto Exento N° 587",
        },
        items: [
          { service: "Otorgamiento de escritura pública", amount: "$6.235" },
          {
            service:
              "Escritura sin apreciación pecuniaria (mandatos, reglamentos de copropiedad, prohibiciones)",
            amount: "$6.235",
          },
          { service: "Diligencia anexa a escritura", amount: "$3.741" },
          { service: "Otorgamiento de testamento abierto", amount: "$18.705" },
          { service: "Otorgamiento de testamento cerrado", amount: "$24.940" },
          { service: "Protocolización de instrumento", amount: "$4.988" },
          { service: "Autorización de copia", amount: "$1.247" },
          {
            service: "Por cada página de escritura matriz o carilla de copia",
            amount: "$748",
          },
        ],
      },
      {
        title: "Instrumentos privados",
        note: "Arancel notarial actualizado a diciembre de 2023.",
        source: {
          href: "https://www.bcn.cl/leychile/navegar?idNorma=129528",
          label: "Decreto Exento N° 587",
        },
        items: [
          {
            service: "Autorización de firma (cuantía hasta $50.000)",
            amount: "$1.247",
          },
          {
            service: "Autorización de firma (cuantía sobre $500.000)",
            amount: "$7.482",
          },
          {
            service: "Autorización de firma sin apreciación pecuniaria",
            amount: "$1.995",
          },
          {
            service: "Certificado de supervivencia o de estado civil",
            amount: "$624",
          },
          {
            service: "Autorización para salir del país (con tres copias)",
            amount: "$3.741",
          },
          {
            service:
              "Carta de poder (para cobro de beneficios sociales: exento)",
            amount: "$0",
          },
          { service: "Declaración con una o más firmas", amount: "$1.247" },
          {
            service: "Compraventa de cosas muebles (más 1‰ sobre el monto)",
            amount: "$6.235",
          },
          { service: "Certificación de documentos", amount: "$1.247" },
          {
            service: "Protesto de letras (sobre $5.000.000)",
            amount: "$14.964",
          },
        ],
      },
      {
        title: "Registro de bienes raíces y comercio",
        note: "Arancel de conservadores actualizado a abril de 2023. Valores sujetos a reajuste legal.",
        source: {
          href: "https://bcn.cl/3los9",
          label: "Decreto Exento N° 588",
        },
        items: [
          {
            service:
              "Inscripción (incluye anotación, citas y certificación en el título)",
            amount: "$4.902",
          },
          {
            service:
              "Inscripción sin cuantía (prohibiciones, embargos, reglamentos de copropiedad)",
            amount: "$8.579",
          },
          { service: "Subinscripción o anotación", amount: "$3.677" },
          {
            service: "Certificado de inscripción o subinscripción",
            amount: "$3.677",
          },
          {
            service:
              "Certificado de gravámenes o prohibiciones (hasta 10 años)",
            amount: "$3.677",
          },
          {
            service:
              "Certificado de gravámenes o prohibiciones (más de 10 años)",
            amount: "$6.128",
          },
          { service: "Inscripción de testamento", amount: "$6.128" },
          { service: "Inscripción especial de herencia", amount: "$4.902" },
          {
            service: "Protocolización, agregación o archivo de documentos",
            amount: "$4.902",
          },
          {
            service: "Autorización de la matriz, copias y certificaciones",
            amount: "$1.226",
          },
        ],
      },
    ] satisfies ArancelArea[],
  },

  about: {
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
    downloadCtaLabel: "Descargar PDF",
    heading: "Documentos online e información",
    lead: "Descargue, complete y reúna los documentos necesarios para su trámite. Todo documento debe ser firmado por el usuario ante el notario.",
    downloads: [
      {
        title: "Autorización trabajo menor de edad",
        description:
          "La concurrencia personal del interesado, con cédula de identidad o pasaporte vigente, es requisito esencial para autorizar instrumentos en este oficio.",
        href: "https://drive.google.com/file/d/1zHkTW4IGhXv1g_QAF6TV1FCUZOg2V8hY/view?usp=sharing",
        icon: "check",
      },
      {
        title: "Autorización viaje menor de edad",
        description:
          "Solicitud notarial necesaria para que un menor de edad pueda viajar dentro o fuera del país sin la compañía de sus padres.",
        href: "https://drive.google.com/file/d/1B20NJEUlOpcY78UPdZsbyqlR0mVjMF3X/view?usp=sharing",
        icon: "plane",
      },
      {
        title: "Carta de poder",
        description:
          "Instrumento que faculta a una persona para actuar en nombre de otra en trámites y gestiones específicas.",
        href: "https://drive.google.com/file/d/1r2LZRZliZu5_J6QJGfhmIo_xD51n8RYT/view?usp=sharing",
        icon: "bolt",
      },
      {
        title: "Declaración jurada",
        description:
          "Documento en el que el otorgante declara, bajo juramento, hechos que pueden ser usados como prueba legal.",
        href: "https://drive.google.com/file/d/1t9u9l6xLt071G6NiQrwO2SZdAMyfh2qt/view?usp=sharing",
        icon: "bookmark",
      },
    ] satisfies DocumentDownload[],

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

  contact: {
    legalName: "Notaría René A. Martínez Loaiza",
    street: "Avenida Serrano 369, oficina 11",
    city: "Melipilla, Chile",
    mapsUrl:
      "https://www.google.com/maps?q=Avenida+Serrano+369,+Melipilla,+Chile",
    phoneDisplay: "(+56 2) 3314 8818",
    phoneE164: "+56233148818",
    email: "notaria.martinez@notariamelipilla.cl",
    schedule: {
      weekdays: "Lunes a viernes · 09:00 a 17:00",
      saturdays: "Sábados · 09:45 a 12:45",
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
  },
} as const;

export type Site = typeof site;
