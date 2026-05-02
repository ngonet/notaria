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
    { href: "#funcionarios", label: "Funcionarios" },
    { href: "#aranceles", label: "Aranceles" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#documentos", label: "Documentos" },
    { href: "#contacto", label: "Contacto" },
    { href: "#calendario", label: "Calendario" },
  ] satisfies NavLink[],

  hero: {
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
      "Aranceles referenciales. Escrituras públicas e instrumentos privados actualizados a diciembre de 2023. Valores del Registro de Bienes Raíces y Comercio corresponden al Decreto 588 de 1998, sujetos a reajuste.",
    areas: [
      {
        title: "Escrituras públicas",
        note: "Arancel notarial actualizado a diciembre de 2023. Se aplica recargo de 1‰ sobre el monto del acto o contrato (límite $319.232.000).",
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
            amount: "$1.195",
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
            amount: "$1.195",
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
        note: "Valores base según Decreto 588 de 1998. Sujetos a reajuste legal.",
        items: [
          {
            service:
              "Inscripción (incluye anotación, citas y certificación en el título)",
            amount: "$2.000",
          },
          {
            service:
              "Inscripción sin cuantía (prohibiciones, embargos, reglamentos de copropiedad)",
            amount: "$3.500",
          },
          { service: "Subinscripción o anotación", amount: "$1.500" },
          {
            service: "Certificado de inscripción o subinscripción",
            amount: "$1.500",
          },
          {
            service:
              "Certificado de gravámenes o prohibiciones (hasta 10 años)",
            amount: "$1.500",
          },
          {
            service:
              "Certificado de gravámenes o prohibiciones (más de 10 años)",
            amount: "$2.500",
          },
          { service: "Inscripción de testamento", amount: "$2.500" },
          { service: "Inscripción especial de herencia", amount: "$2.000" },
          {
            service: "Protocolización, agregación o archivo de documentos",
            amount: "$2.000",
          },
          {
            service: "Autorización de la matriz, copias y certificaciones",
            amount: "$500",
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
          "Apertura en pleno centro de Melipilla, Avenida Serrano 374, a media cuadra de la Plaza de Armas.",
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
      heading: "Copias digitales online",
      body: "Obtenga una copia digital de sus documentos tramitados en nuestra notaría a través del Portal Fojas.cl. Seleccione “Notaría René Alejandro Martínez Loaiza” e ingrese su número de certificado.",
      href: "https://www.fojas.cl",
      logo: "/images/fojas2.png",
    },
  },

  contact: {
    legalName: "Notaría René A. Martínez Loaiza",
    street: "Avenida Serrano 374",
    city: "Melipilla, Chile",
    mapsUrl: "https://goo.gl/maps/W9GqyVEoBXk",
    phoneDisplay: "(+56 2) 3314 8818",
    phoneE164: "+56233148818",
    email: "notaria.martinez@notariamelipilla.cl",
    schedule: {
      weekdays: "Lunes a viernes · 09:00 a 17:00",
      saturdays: "Sábados · 09:45 a 12:45",
    },
  } satisfies ContactInfo,

  calendar: {
    heading: "Calendario de atención",
    lead: "Horarios de atención, reservas y sesiones remotas. Disponibilidad actualizada en tiempo real.",
  },

  footer: {
    copyright: `Copyright © ${new Date().getFullYear()} Notaría Martínez · Todos los derechos reservados.`,
  },
} as const;

export type Site = typeof site;
