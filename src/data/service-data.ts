import IconProps from 'types/icon';

// Importar iconos de la carpeta lineal
import CloudComputingTwo from 'icons/lineal/CloudComputingTwo';
import ChatTwo from 'icons/lineal/ChatTwo';
import LightBulb from 'icons/lineal/LightBulb';
import ShoppingBasket from 'icons/lineal/ShoppingBasket';
import ClockThree from 'icons/lineal/ClockThree';
import List from 'icons/lineal/List';
import Email from 'icons/lineal/Email';
import Target from 'icons/lineal/Target';
import Shield from 'icons/lineal/Shield';
import CheckList from 'icons/lineal/CheckList';
import VideoEditing from 'icons/lineal/VideoEditing';
import Analytics from 'icons/lineal/Analytics';
import Team from 'icons/lineal/Team';
import Savings from 'icons/lineal/Savings';
import User from 'icons/lineal/User';
import Settings from 'icons/lineal/Settings';
import BriefcaseTwo from 'icons/lineal/BriefcaseTwo';
import Gift from 'icons/lineal/Gift';

// Definimos las rutas a los iconos SVG que están disponibles en public/img/icons/solid
const ICON_PATH = '/img/icons/solid/';
const iconUrls = {
  baby: `${ICON_PATH}employees.svg`,
  bottle: `${ICON_PATH}health-insurance.svg`,
  calendar: `${ICON_PATH}note.svg`,
  videoChat: `${ICON_PATH}video-chat.svg`,
  plan: `${ICON_PATH}list.svg`,
  star: `${ICON_PATH}medal.svg`,
  users: `${ICON_PATH}team.svg`,
  moon: `${ICON_PATH}lamp.svg`,
};

// Definición de tipos para los servicios
export interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  category: 'baby' | 'child' | 'general';
  categoryLabel: string;
  iconUrl: string; // Ruta al SVG del icono
  heroImageUrl: string; // Ruta a la imagen hero para la página de detalle
  description: string;
  shortDescription: string;
  forWho: string[]; // Texto para '¿Para quién es?' múltiple
  price: number;
  currency: string; // Added currency field (e.g., 'eur', 'usd')
  duration: string;
  features: {
    id: number;
    title: string;
    featureIcon: React.FC<IconProps>; // Componente Icon para la característica
    description: string; // Descripción corta de la característica
  }[];
  highlighted?: boolean;
  requiresCalendly?: boolean;
  calendlyUrl?: string;
  calendlyDescription?: string;
  includes?: string[];
  color?: string; // Color representativo del servicio
  process?: {
    title: string;
    steps: {
      id: number;
      title: string;
      description: string;
    }[];
  };
  faq?: {
    question: string;
    answer: string;
  }[];
  stripePaymentLink?: string | null; // Link de pago de Stripe (opcional)
}

// Categorías de servicios
export const serviceCategories = [
  {
    id: 'baby',
    label: '0-6 meses',
    description: 'Servicios especializados para bebés de 0 a 6 meses'
  },
  {
    id: 'child',
    label: '6 meses a 4 años',
    description: 'Servicios adaptados para niños de 6 meses a 4 años'
  },
  {
    id: 'general',
    label: 'Servicios generales',
    description: 'Otros servicios complementarios'
  }
];

// Datos de los servicios
export const serviceList: ServiceItem[] = [
  // Servicios de 0-6 meses
  {
    id: 1,
    title: 'Asesoría integral Big Bang',
    slug: 'asesoria-big-bang',
    category: 'baby',
    categoryLabel: '0-6 meses',
    iconUrl: iconUrls.baby,
    heroImageUrl: '/img/via-lactea/illustrations/asesoria-big-bang-hero.png',
    description: 'Consulta online de 1 hora para resolver dudas de lactancia (materna o artificial), inicio de alimentación complementaria y BLW (Baby Let Weanning), ventanas de sueño, horarios y rutinas, llegada de nuevo hermano,... cualquier duda que os surja de los primeros 6 meses.',
    shortDescription: 'Resuelve todas tus dudas sobre los primeros 6 meses de tu bebé en una consulta personalizada.',
    forWho: [
      'Padres primerizos',
      'Familias con bebés de 0 a 6 meses',
      'Quienes buscan orientación en lactancia, alimentación y sueño'
    ],
    price: 90,
    currency: 'eur',
    duration: '1 hora + 2 semanas de seguimiento por email',
    features: [
      {
        id: 1,
        title: 'Consulta online personalizada',
        featureIcon: CloudComputingTwo,
        description: 'Consulta online personalizada para resolver todas tus dudas sobre los primeros 6 meses de tu bebé.'
      },
      {
        id: 2,
        title: 'Resolución de dudas sobre lactancia',
        featureIcon: ChatTwo,
        description: 'Asesoramiento especializado en lactancia materna o artificial para superar cualquier dificultad.'
      },
      {
        id: 3,
        title: 'Asesoramiento sobre alimentación complementaria',
        featureIcon: ShoppingBasket,
        description: 'Ayuda para implementar la alimentación complementaria y BLW (Baby Let Weanning) para tu bebé.'
      },
      {
        id: 4,
        title: 'Consultas sobre ventanas de sueño',
        featureIcon: ClockThree,
        description: 'Asesoramiento sobre cómo manejar las ventanas de sueño para tu bebé.'
      },
      {
        id: 5,
        title: 'Ayuda con horarios y rutinas',
        featureIcon: List,
        description: 'Asistencia para establecer horarios y rutinas para tu bebé.'
      },
      {
        id: 6,
        title: 'Seguimiento por email durante 2 semanas',
        featureIcon: Email,
        description: 'Seguimiento personalizado por email durante 2 semanas para asegurar que todo va bien.'
      }
    ],
    highlighted: true,
    requiresCalendly: true,
    color: 'purple',
    includes: [
      'Guía "Big Bang - Sus primeros momentos"',
      'Seguimiento por email durante 2 semanas'
    ],
    process: {
      title: 'Cómo funciona la asesoría',
      steps: [
        {
          id: 1,
          title: 'Reserva tu cita',
          description: 'Elige el día y la hora que mejor te convenga para tu consulta online.'
        },
        {
          id: 2,
          title: 'Completa el formulario previo',
          description: 'Te enviaremos un breve cuestionario para conocer mejor tu situación y preparar la asesoría.'
        },
        {
          id: 3,
          title: 'Consulta personalizada',
          description: 'Durante 1 hora abordaremos todas tus dudas y preocupaciones específicas.'
        },
        {
          id: 4,
          title: 'Seguimiento posterior',
          description: 'Dispondrás de 2 semanas de resolución de dudas por email para asegurar que todo va bien.'
        }
      ]
    },
    faq: [
      {
        question: '¿Es necesario algún equipo especial para la consulta online?',
        answer: 'Solo necesitas un dispositivo con conexión a internet (ordenador, tablet o móvil) con cámara y micrófono. Usamos una plataforma sencilla y segura para la videollamada.'
      },
      {
        question: '¿Puedo cambiar la fecha de mi consulta si surge algún imprevisto?',
        answer: 'Sí, puedes reprogramar tu cita hasta 24 horas antes de la hora reservada sin ningún coste adicional.'
      }
    ],
    stripePaymentLink: 'https://buy.stripe.com/14k8yC5OW8Ae9448wE',
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/asesoria-big-bang?hide_gdpr_banner=1&primary_color=605dba',
    calendlyDescription: `✨ ¡Bienvenida a los primeros meses! ✨

¿Dudas sobre lactancia 🤱, sueño 😴, alimentación 🥕 o rutinas ⏰?

🔔📆 Reserva tu Asesoría Big Bang de 1 hora y resolveremos juntas todas esas preguntas iniciales (0-6 meses).

¿Qué haremos?

🔎 Analizaremos tu situación específica para darte pautas claras y adaptadas.

👀 Si está al cuidado de dos, genial si podéis estar ambos.

📝 ¡Prepara tus preguntas y sal de dudas!`
  },
  {
    id: 2,
    title: 'Asesoría de lactancia Vía láctea',
    slug: 'asesoria-lactancia',
    category: 'baby',
    categoryLabel: '0-6 meses',
    iconUrl: iconUrls.bottle,
    heroImageUrl: '/img/via-lactea/illustrations/asesoria-via-lactea-hero.png',
    description: 'Consulta online de 1 hora para resolver dudas de lactancia (materna o artificial), inicio de alimentación complementaria, BLW (Baby Let Weanning), destete, lactancia diferida, lactancia mixta, mejores posiciones, arículos necesarios, etc.',
    shortDescription: 'Asesoramiento especializado en lactancia materna o artificial para superar cualquier dificultad.',
    forWho: [
      'Madres con dificultades de lactancia',
      'Padres que requieren asesoría de posiciones y destete',
      'Familias iniciando alimentación complementaria'
    ],
    price: 60,
    currency: 'eur',
    duration: '1 hora',
    features: [
      {
        id: 1,
        title: 'Consulta online especializada en lactancia',
        featureIcon: CloudComputingTwo,
        description: 'Consulta online especializada en lactancia para resolver dudas sobre la alimentación del bebé.'
      },
      {
        id: 2,
        title: 'Asesoramiento sobre posiciones correctas',
        featureIcon: Target,
        description: 'Asesoramiento sobre cómo mantener una posición correcta para la lactancia.'
      },
      {
        id: 3,
        title: 'Ayuda con problemas de agarre',
        featureIcon: Shield,
        description: 'Asistencia para resolver problemas comunes al agarrar el pezón.'
      },
      {
        id: 4,
        title: 'Orientación sobre lactancia mixta',
        featureIcon: Settings,
        description: 'Asesoramiento sobre la lactancia mixta para bebés.'
      },
      {
        id: 5,
        title: 'Consejos para destete respetuoso',
        featureIcon: CheckList,
        description: 'Recomendaciones para destetar de manera respetuosa y segura.'
      },
      {
        id: 6,
        title: 'Recomendación de artículos y accesorios',
        featureIcon: ShoppingBasket,
        description: 'Asesoramiento sobre la elección de artículos y accesorios adecuados para la lactancia.'
      }
    ],
    requiresCalendly: true,
    color: 'aqua',
    process: {
      title: 'Asesoría de lactancia paso a paso',
      steps: [
        {
          id: 1,
          title: 'Reserva tu asesoría',
          description: 'Escoge el momento que mejor se adapte a tu rutina para nuestra sesión online.'
        },
        {
          id: 2,
          title: 'Explícanos tu situación',
          description: 'Completa un breve cuestionario para que podamos entender tus dificultades específicas.'
        },
        {
          id: 3,
          title: 'Recibe asesoramiento personalizado',
          description: 'Durante la consulta, analizaremos tu situación y te proporcionaremos soluciones prácticas.'
        },
        {
          id: 4,
          title: 'Implementa las recomendaciones',
          description: 'Pon en práctica las técnicas y consejos proporcionados para mejorar tu experiencia de lactancia.'
        }
      ]
    },
    stripePaymentLink: 'https://buy.stripe.com/6oE9CGcdk2bQfssdQX',
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/asesoria-lactancia?hide_gdpr_banner=1&primary_color=605dba',
    calendlyDescription: `🤱 ¿La lactancia no está siendo como esperabas? 🤱

¿Dolor? ¿Dudas sobre el agarre? ¿Poca ganancia de peso? ¿Quieres preparar la vuelta al trabajo?

🔔📆 Reserva tu Asesoría de Lactancia de 1 hora y buscaremos soluciones juntas.

¿Qué haremos?

🔎 Evaluaremos la toma, resolveremos tus dudas y te daré herramientas prácticas.

👀 Si es posible, ten a tu bebé contigo durante la sesión.

💪 ¡Disfruta de tu lactancia con confianza!`
  },

  // Servicios de 6 meses a 4 años
  {
    id: 3,
    title: 'Valoración gratuita',
    slug: 'valoracion-gratuita',
    category: 'general',
    categoryLabel: 'Servicios generales',
    iconUrl: iconUrls.calendar,
    heroImageUrl: '/img/via-lactea/illustrations/valoracion-hero.png',
    description: '30 minutos para valoración personalizada de la situación de sueño de tu hijo.',
    shortDescription: 'Descubre cómo podemos ayudarte con una valoración inicial sin compromiso.',
    forWho: [
      'Padres de niños de 6 meses a 4 años',
      'Familias con dudas sobre patrones de sueño',
      'Quienes buscan recomendaciones iniciales sin compromiso'
    ],
    price: 0,
    currency: 'eur',
    duration: '30 minutos',
    features: [
      {
        id: 1,
        title: 'Consulta online gratuita',
        featureIcon: CloudComputingTwo,
        description: 'Consulta online gratuita para obtener una valoración inicial de la situación de sueño de tu hijo.'
      },
      {
        id: 2,
        title: 'Evaluación inicial de la situación',
        featureIcon: Analytics,
        description: 'Análisis detallado de la situación de sueño de tu hijo para identificar posibles problemas.'
      },
      {
        id: 3,
        title: 'Recomendaciones básicas personalizadas',
        featureIcon: LightBulb,
        description: 'Recomendaciones específicas para mejorar la situación de sueño de tu hijo.'
      },
      {
        id: 4,
        title: 'Información sobre planes disponibles',
        featureIcon: List,
        description: 'Conoce las opciones de planes disponibles para tu hijo.'
      }
    ],
    highlighted: true,
    requiresCalendly: true,
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba',
    calendlyDescription: `¿Qué haremos?

🔎 Estudiaré vuestro caso detenidamente y veremos las posibles opciones durante la videollamada.

👀 Si está al cuidado de dos, lo ideal es que estéis presentes ambos papás y resolver cualquier duda.

🤓 ¡Y recuerda: ten a mano tus notas!`,
    color: 'green',
    process: {
      title: 'Valoración gratuita paso a paso',
      steps: [
        {
          id: 1,
          title: 'Agenda tu valoración',
          description: 'Selecciona un horario disponible para tu consulta gratuita de 30 minutos.'
        },
        {
          id: 2,
          title: 'Cuéntanos sobre tu situación',
          description: 'Describe brevemente los desafíos de sueño que estás enfrentando con tu hijo.'
        },
        {
          id: 3,
          title: 'Recibe una evaluación inicial',
          description: 'Analizaremos tu caso y te ofreceremos una primera orientación sobre posibles soluciones.'
        },
        {
          id: 4,
          title: 'Conoce nuestros planes',
          description: 'Te presentaremos las opciones disponibles que mejor se adapten a tus necesidades específicas.'
        }
      ]
    },
    stripePaymentLink: null // Es gratuito
  },
  {
    id: 4,
    title: 'Videollamada SOS',
    slug: 'videollamada-sos',
    category: 'general',
    categoryLabel: 'Servicios generales',
    iconUrl: iconUrls.videoChat,
    heroImageUrl: '/img/via-lactea/illustrations/llamada-sos.png',
    description: '30 minutos para resolución de dudas. Se priorizará tu consulta lo máximo posible.',
    shortDescription: 'Atención prioritaria para resolver dudas urgentes sobre el sueño de tu hijo.',
    forWho: [
      'Familias con problemas urgentes de sueño',
      'Padres que necesitan asistencia rápida',
      'Quienes requieren atención prioritaria'
    ],
    price: 50,
    currency: 'eur',
    duration: '30 minutos',
    features: [
      {
        id: 1,
        title: 'Atención prioritaria',
        featureIcon: Shield,
        description: 'Atención prioritaria para resolver dudas urgentes sobre el sueño de tu hijo.'
      },
      {
        id: 2,
        title: 'Resolución de dudas específicas',
        featureIcon: ChatTwo,
        description: 'Resolución de dudas específicas sobre el sueño de tu hijo.'
      },
      {
        id: 3,
        title: 'Recomendaciones inmediatas',
        featureIcon: LightBulb,
        description: 'Recomendaciones prácticas para resolver dudas urgentes sobre el sueño de tu hijo.'
      },
      {
        id: 4,
        title: 'Consulta enfocada en problemas concretos',
        featureIcon: Target,
        description: 'Consulta enfocada en problemas concretos sobre el sueño de tu hijo.'
      }
    ],
    requiresCalendly: true,
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/videollamada-sos?hide_gdpr_banner=1&primary_color=605dba',
    calendlyDescription: `🚨 ¿Tienes alguna urgencia puntual? 🚨 

¿Te vas de vacaciones 🚢 o tienes una mudanza 🚚 y tu bebé vuelve a dormir mal?

🔔📆 Reserva cita con una videollamada SOS de 30 minutos y aclara tus dudas sobre el sueño y la lactancia.

¿Qué haremos?

🔎 Trataré vuestro caso detenidamente y veremos las pautas y próximos pasos durante la videollamada.

👀 Si está al cuidado de dos, lo ideal es que estéis presentes ambos papás y resolver cualquier duda.

📧 Finalmente, te enviaré por correo los ajustes recomendados`,
    color: 'red',
    process: {
      title: 'Videollamada SOS paso a paso',
      steps: [
        {
          id: 1,
          title: 'Solicita tu consulta urgente',
          description: 'Reserva una videollamada SOS y cuéntanos brevemente tu situación urgente.'
        },
        {
          id: 2,
          title: 'Recibe prioridad en la agenda',
          description: 'Te asignaremos el primer horario disponible para atender tu consulta.'
        },
        {
          id: 3,
          title: 'Explica tu situación concreta',
          description: 'Durante la videollamada, enfócate en el problema específico que necesitas resolver.'
        },
        {
          id: 4,
          title: 'Obtén soluciones inmediatas',
          description: 'Recibirás recomendaciones prácticas que podrás implementar de inmediato.'
        }
      ]
    },
    stripePaymentLink: 'https://buy.stripe.com/dR69CGelsaIm3JK006'
  },
  {
    id: 5,
    title: 'Plan de sueño Luna',
    slug: 'plan-luna',
    category: 'child',
    categoryLabel: '6 meses a 4 años',
    iconUrl: iconUrls.plan,
    heroImageUrl: '/img/via-lactea/illustrations/luna-hero.png',
    description: 'Plan básico sin seguimiento que incluye formulario inicial, diario de sueño de 2 días y una videollamada para crear el plan de sueño personalizado.',
    shortDescription: 'Plan básico para familias que necesitan orientación pero pueden implementar el plan por su cuenta.',
    forWho: [
      'Familias que prefieren implementar por su cuenta',
      'Quienes buscan orientación básica y plan por escrito',
      'Padres con disponibilidad limitada de seguimiento'
    ],
    price: 200,
    currency: 'eur',
    duration: '1 videollamada',
    features: [
      {
        id: 1,
        title: 'Formulario inicial detallado',
        featureIcon: CheckList,
        description: 'Formulario inicial detallado para entender la situación de sueño de tu hijo.'
      },
      {
        id: 2,
        title: 'Análisis de diario de sueño de 2 días',
        featureIcon: Analytics,
        description: 'Análisis de diario de sueño de 2 días para identificar patrones y problemas.'
      },
      {
        id: 3,
        title: 'Videollamada para crear plan personalizado',
        featureIcon: VideoEditing,
        description: 'Videollamada para crear un plan de sueño personalizado adaptado a tu familia.'
      },
      {
        id: 4,
        title: 'Plan de sueño por escrito',
        featureIcon: List,
        description: 'Plan de sueño por escrito para que puedas implementarlo por tu cuenta.'
      },
      {
        id: 5,
        title: 'Sin seguimiento posterior',
        featureIcon: Shield,
        description: 'Plan sin seguimiento posterior para familias que pueden implementarlo por su cuenta.'
      }
    ],
    requiresCalendly: true,
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba',
    color: 'violet',
    process: {
      title: 'Plan Luna paso a paso',
      steps: [
        {
          id: 1,
          title: 'Completa el formulario inicial',
          description: 'Responderás 40 preguntas para entender en profundidad la situación de sueño de tu hijo.'
        },
        {
          id: 2,
          title: 'Registra el diario de sueño',
          description: 'Durante 2 días, anotarás los patrones de sueño de tu hijo siguiendo nuestras indicaciones.'
        },
        {
          id: 3,
          title: 'Videollamada para crear el plan',
          description: 'Juntos diseñaremos un plan de sueño personalizado adaptado a tu familia.'
        },
        {
          id: 4,
          title: 'Recibe tu plan por escrito',
          description: 'Te enviaremos el plan detallado por escrito para que puedas implementarlo por tu cuenta.'
        }
      ]
    },
    stripePaymentLink: 'https://buy.stripe.com/3csaGKcdkeYC8009AF'
  },
  {
    id: 6,
    title: 'Plan de sueño Enana Blanca',
    slug: 'plan-enana-blanca',
    category: 'child',
    categoryLabel: '6 meses a 4 años',
    iconUrl: iconUrls.plan,
    heroImageUrl: '/img/via-lactea/illustrations/enana-blanca-hero.png',
    description: 'Plan de 2 semanas que incluye formulario inicial, diario de sueño, videollamada para crear el plan y una videollamada de seguimiento a los 14 días.',
    shortDescription: 'Plan con seguimiento de 2 semanas para asegurar la correcta implementación de las técnicas.',
    forWho: [
      'Familias que desean acompañamiento de 2 semanas',
      'Padres que necesitan soporte continuo a medio plazo',
      'Quienes buscan seguimiento personalizado'
    ],
    price: 300,
    currency: 'eur',
    duration: '2 semanas',
    features: [
      {
        id: 1,
        title: 'Formulario inicial detallado',
        featureIcon: CheckList,
        description: 'Formulario inicial detallado para entender la situación de sueño de tu hijo.'
      },
      {
        id: 2,
        title: 'Análisis de diario de sueño de 2 días',
        featureIcon: Analytics,
        description: 'Análisis de diario de sueño de 2 días para identificar patrones y problemas.'
      },
      {
        id: 3,
        title: 'Videollamada para crear plan personalizado',
        featureIcon: VideoEditing,
        description: 'Videollamada para crear un plan de sueño personalizado adaptado a tu familia.'
      },
      {
        id: 4,
        title: 'Plan de sueño por escrito',
        featureIcon: List,
        description: 'Plan de sueño por escrito para que puedas implementarlo por tu cuenta.'
      },
      {
        id: 5,
        title: 'Videollamada de seguimiento a los 14 días',
        featureIcon: VideoEditing,
        description: 'Videollamada de seguimiento a los 14 días para evaluar progresos y hacer ajustes necesarios.'
      }
    ],
    requiresCalendly: true,
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba',
    color: 'sky',
    process: {
      title: 'Plan Enana Blanca paso a paso',
      steps: [
        {
          id: 1,
          title: 'Evaluación inicial',
          description: 'Completarás un formulario de 40 preguntas y un diario de sueño de 2 días.'
        },
        {
          id: 2,
          title: 'Creación del plan',
          description: 'En la primera videollamada, diseñaremos juntos un plan personalizado que recibirás por escrito.'
        },
        {
          id: 3,
          title: 'Implementación',
          description: 'Durante 14 días, pondrás en práctica las estrategias del plan.'
        },
        {
          id: 4,
          title: 'Seguimiento',
          description: 'Realizaremos una videollamada de seguimiento para evaluar progresos y hacer ajustes necesarios.'
        }
      ]
    },
    stripePaymentLink: 'https://buy.stripe.com/eVa3ei0uCeYC4NOeUY'
  },
  {
    id: 7,
    title: 'Plan de sueño Sol',
    slug: 'plan-sol',
    category: 'child',
    categoryLabel: '6 meses a 4 años',
    iconUrl: iconUrls.star,
    heroImageUrl: '/img/via-lactea/illustrations/sol-hero.png',
    description: 'Plan de 4 semanas que incluye formulario inicial, diario de sueño, videollamada inicial, dos videollamadas de seguimiento y pautas finales por escrito.',
    shortDescription: 'Plan completo de 4 semanas con seguimiento continuo para transformar los hábitos de sueño.',
    forWho: [
      'Familias que buscan transformación completa de hábitos de sueño',
      'Quienes desean soporte intensivo durante 4 semanas',
      'Padres que quieren múltiples videollamadas de seguimiento'
    ],
    price: 400,
    currency: 'eur',
    duration: '4 semanas',
    features: [
      {
        id: 1,
        title: 'Formulario inicial detallado',
        featureIcon: CheckList,
        description: 'Formulario inicial detallado para entender la situación de sueño de tu hijo.'
      },
      {
        id: 2,
        title: 'Análisis de diario de sueño de 2 días',
        featureIcon: Analytics,
        description: 'Análisis de diario de sueño de 2 días para identificar patrones y problemas.'
      },
      {
        id: 3,
        title: 'Primera videollamada para crear el plan',
        featureIcon: VideoEditing,
        description: 'Primera videollamada para crear un plan de sueño personalizado adaptado a tu familia.'
      },
      {
        id: 4,
        title: 'Plan de sueño por escrito',
        featureIcon: BriefcaseTwo,
        description: 'Plan de sueño por escrito para que puedas implementarlo por tu cuenta.'
      },
      {
        id: 5,
        title: 'Segunda videollamada de seguimiento (14 días)',
        featureIcon: VideoEditing,
        description: 'Segunda videollamada de seguimiento (14 días) para evaluar progresos y hacer ajustes necesarios.'
      },
      {
        id: 6,
        title: 'Tercera videollamada final (28 días)',
        featureIcon: VideoEditing,
        description: 'Tercera videollamada final (28 días) para revisar resultados y proporcionar pautas futuras por escrito.'
      },
      {
        id: 7,
        title: 'Pautas de seguimiento por escrito',
        featureIcon: BriefcaseTwo,
        description: 'Pautas de seguimiento por escrito para mantener y mejorar el sueño de tu hijo.'
      },
      /*{
        id: 8,
        title: '1 mes de suscripción mensual incluido',
        featureIcon: Gift,
        description: '1 mes de suscripción mensual incluido para mantener y mejorar el sueño de tu hijo.'
      }*/
    ],
    highlighted: true,
    requiresCalendly: true,
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba',
    color: 'yellow',
    process: {
      title: 'Plan Sol paso a paso',
      steps: [
        {
          id: 1,
          title: 'Diagnóstico completo',
          description: 'Análisis detallado a través de formulario y diario de sueño de 2 días.'
        },
        {
          id: 2,
          title: 'Creación del plan personalizado',
          description: 'Primera videollamada para diseñar juntos tu plan de sueño adaptado, que recibirás por escrito.'
        },
        {
          id: 3,
          title: 'Primera fase de implementación',
          description: 'Durante 14 días aplicarás las técnicas con apoyo y seguimiento.'
        },
        {
          id: 4,
          title: 'Ajustes intermedios',
          description: 'Segunda videollamada para evaluar progresos y realizar ajustes necesarios.'
        },
        {
          id: 5,
          title: 'Consolidación',
          description: 'Continuación de la implementación durante 14 días más.'
        },
        {
          id: 6,
          title: 'Evaluación final',
          description: 'Tercera videollamada para revisar resultados y proporcionar pautas futuras por escrito.'
        }
      ]
    },
    stripePaymentLink: 'https://buy.stripe.com/bIYg144KS4jYa88003'
  },
  {
    id: 8,
    title: 'Plan de sueño Gigante Roja',
    slug: 'plan-gigante-roja',
    category: 'child',
    categoryLabel: '6 meses a 4 años',
    iconUrl: iconUrls.star,
    heroImageUrl: '/img/via-lactea/illustrations/gigante-roja-hero.png',
    description: 'Plan premium de 6 semanas que incluye pautas iniciales, formulario detallado, diario de sueño, tres videollamadas y pautas finales por escrito.',
    shortDescription: 'Nuestro plan más completo con pautas iniciales y 6 semanas de acompañamiento para casos complejos.',
    forWho: [
      'Familias con casos complejos de sueño',
      'Quienes requieren acompañamiento extendido de 6 semanas',
      'Padres que necesitan varias videollamadas y seguimiento detallado'
    ],
    price: 500,
    currency: 'eur',
    duration: '6 semanas',
    features: [
      {
        id: 1,
        title: 'Formulario inicial detallado',
        featureIcon: CheckList,
        description: 'Formulario inicial detallado para entender la situación de sueño de tu hijo.'
      },
      {
        id: 2,
        title: 'Análisis de diario de sueño de 2 días',
        featureIcon: Analytics,
        description: 'Análisis de diario de sueño de 2 días para identificar patrones y problemas.'
      },
      {
        id: 3,
        title: 'Pautas iniciales personalizadas',
        featureIcon: LightBulb,
        description: 'Pautas iniciales personalizadas para preparar el terreno antes del plan completo.'
      },
      {
        id: 4,
        title: 'Primera videollamada para crear el plan (tras 10 días)',
        featureIcon: VideoEditing,
        description: 'Primera videollamada para crear un plan personalizado adaptado a tu hijo tras 10 días.'
      },
      {
        id: 5,
        title: 'Plan de sueño por escrito',
        featureIcon: List,
        description: 'Plan de sueño por escrito para que puedas implementarlo por tu cuenta.'
      },
      {
        id: 6,
        title: 'Segunda videollamada de seguimiento (14 días después)',
        featureIcon: VideoEditing,
        description: 'Segunda videollamada de seguimiento (14 días después) para evaluar progresos y hacer ajustes necesarios.'
      },
      {
        id: 7,
        title: 'Tercera videollamada final (14 días después)',
        featureIcon: VideoEditing,
        description: 'Tercera videollamada final (14 días después) para revisar resultados y proporcionar pautas futuras por escrito.'
      },
      {
        id: 8,
        title: 'Pautas de seguimiento finales por escrito',
        featureIcon: BriefcaseTwo,
        description: 'Pautas de seguimiento finales por escrito para mantener y mejorar el sueño de tu hijo.'
      },
      /*{
        id: 9,
        title: '3 meses de suscripción mensual incluidos',
        featureIcon: Gift,
        description: '3 meses de suscripción mensual incluidos para mantener y mejorar el sueño de tu hijo.'
      }*/
    ],
    highlighted: true,
    requiresCalendly: true,
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba',
    color: 'orange',
    process: {
      title: 'Plan Gigante Roja paso a paso',
      steps: [
        {
          id: 1,
          title: 'Evaluación exhaustiva',
          description: 'Análisis completo mediante formulario de 40 preguntas y diario de sueño de 2 días.'
        },
        {
          id: 2,
          title: 'Pautas iniciales',
          description: 'Recibirás recomendaciones iniciales para preparar el terreno antes del plan completo.'
        },
        {
          id: 3,
          title: 'Implementación inicial',
          description: 'Durante 10 días, aplicarás las pautas iniciales.'
        },
        {
          id: 4,
          title: 'Creación del plan personalizado',
          description: 'Primera videollamada para diseñar el plan completo, que recibirás por escrito.'
        },
        {
          id: 5,
          title: 'Primera fase de seguimiento',
          description: 'Implementación durante 14 días con apoyo constante.'
        },
        {
          id: 6,
          title: 'Seguimiento intermedio',
          description: 'Segunda videollamada para evaluar progresos y ajustar el plan según sea necesario.'
        },
        {
          id: 7,
          title: 'Fase de consolidación',
          description: 'Continúa la implementación durante 14 días más.'
        },
        {
          id: 8,
          title: 'Cierre y proyección',
          description: 'Tercera videollamada para evaluar resultados y entrega de pautas futuras por escrito.'
        }
      ]
    },
    stripePaymentLink: 'https://buy.stripe.com/3cs8yCgtA8Ae9445kk'
  },
  {
    id: 9,
    title: 'Semana de seguimiento',
    slug: 'semana-seguimiento',
    category: 'general',
    categoryLabel: 'Servicios generales',
    iconUrl: iconUrls.calendar,
    heroImageUrl: '/img/via-lactea/illustrations/semana-seguimiento-hero.png',
    description: 'Para antiguos pacientes que necesiten una semana extra a uno de nuestros planes. Incluye plan de sueño con diarios y seguimiento diario por Whatsapp o email.',
    shortDescription: 'Semana adicional de seguimiento para antiguos clientes que necesitan apoyo extra.',
    forWho: [
      'Antiguos clientes que requieren apoyo extra',
      'Familias que finalizaron un plan y quieren más seguimiento',
      'Quienes necesitan ajustes adicionales a su plan'
    ],
    price: 150,
    currency: 'eur',
    duration: '1 semana',
    features: [
      {
        id: 1,
        title: 'Solo para antiguos clientes',
        featureIcon: User,
        description: 'Solo para antiguos clientes que ya han recibido nuestro servicio.'
      },
      {
        id: 2,
        title: 'Revisión del plan de sueño',
        featureIcon: CheckList,
        description: 'Revisión del plan de sueño actual para identificar posibles mejoras.'
      },
      {
        id: 3,
        title: 'Nuevos diarios de sueño',
        featureIcon: List,
        description: 'Registro de nuevos diarios de sueño para seguir el progreso.'
      },
      {
        id: 4,
        title: 'Seguimiento diario por Whatsapp o email',
        featureIcon: Email,
        description: 'Seguimiento diario por Whatsapp o email para recibir apoyo y consejos.'
      },
      {
        id: 5,
        title: 'Ajustes personalizados según necesidad',
        featureIcon: Settings,
        description: 'Ajustes personalizados según las necesidades específicas de cada cliente.'
      }
    ],
    requiresCalendly: true,
    color: 'violet',
    stripePaymentLink: 'https://buy.stripe.com/5kA2ae3GOdUyfss002',
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/semana-seguimiento?hide_gdpr_banner=1&primary_color=605dba',
    calendlyDescription: `📈 ¿Necesitas un ajuste en el plan? 📈

Esta Semana de Seguimiento es EXCLUSIVA para familias que ya habéis hecho un plan conmigo.

🔔📆 Reserva tu semana de seguimiento y revisaremos progresos, haremos ajustes y resolveremos nuevas dudas.

¿Qué incluye?

🔎 Revisión de la situación actual y ajuste del plan.

💬 Seguimiento diario por WhatsApp/email durante 7 días.

💪 ¡Consolidamos esos buenos hábitos!`
  },
  {
    id: 10,
    title: 'Asesorías grupales',
    slug: 'asesoria-grupal',
    category: 'general',
    categoryLabel: 'Servicios generales',
    iconUrl: iconUrls.users,
    heroImageUrl: '/img/via-lactea/illustrations/asesoria-grupal.png',
    description: 'Plan de sueño Sol en formato grupal (máximo 4 personas) con un descuento del 30% para cada participante.',
    shortDescription: 'Asesoría en grupo reducido con todas las ventajas del Plan Sol a un precio más accesible.',
    forWho: [
      'Grupos de hasta 4 familias con situaciones similares',
      'Quienes prefieren aprendizaje compartido y apoyo grupal',
      'Padres que buscan descuento y dinámica colaborativa'
    ],
    price: 280,
    currency: 'eur',
    duration: '4 semanas',
    features: [
      {
        id: 1,
        title: 'Grupos de máximo 4 personas',
        featureIcon: Team,
        description: 'Grupos de máximo 4 personas para compartir experiencias y apoyo.'
      },
      {
        id: 2,
        title: 'Mismas características que el Plan Sol',
        featureIcon: CheckList,
        description: 'Características idénticas al Plan Sol para mantener la consistencia.'
      },
      {
        id: 3,
        title: 'Beneficio de aprendizaje compartido',
        featureIcon: LightBulb,
        description: 'Aprenderás de las experiencias y consejos de otros miembros del grupo.'
      },
      {
        id: 4,
        title: 'Descuento del 30% sobre el precio individual',
        featureIcon: Savings,
        description: 'Descuento del 30% sobre el precio individual para reducir el coste.'
      },
      {
        id: 5,
        title: 'Atención personalizada dentro del grupo',
        featureIcon: User,
        description: 'Atención personalizada para cada miembro del grupo para adaptarse a sus necesidades.'
      }
    ],
    requiresCalendly: true,
    calendlyUrl: 'https://calendly.com/asesoriainfantilvialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba',
    color: 'pink',
    process: {
      title: 'Asesorías grupales paso a paso',
      steps: [
        {
          id: 1,
          title: 'Formación del grupo',
          description: 'Te unirás a un grupo reducido de máximo 4 familias con situaciones similares.'
        },
        {
          id: 2,
          title: 'Evaluación individual',
          description: 'Cada familia completa su formulario y diario de sueño particulares.'
        },
        {
          id: 3,
          title: 'Sesiones grupales',
          description: 'Participarás en videollamadas conjuntas donde se abordarán todas las situaciones.'
        },
        {
          id: 4,
          title: 'Plan personalizado',
          description: 'Cada familia recibe su propio plan de sueño adaptado a su situación específica.'
        },
        {
          id: 5,
          title: 'Seguimiento grupal',
          description: 'Las sesiones de seguimiento son en grupo, beneficiándote de la experiencia compartida.'
        }
      ]
    },
    stripePaymentLink: null // Aún no definido, requiere coordinación
  }
];

// Función para obtener servicios por categoría
export const getServicesByCategory = (category: string) => {
  return serviceList.filter(service => service.category === category);
};

// Función para obtener un servicio por su slug
export const getServiceBySlug = (slug: string) => {
  return serviceList.find(service => service.slug === slug);
};

// Función para obtener servicios destacados
export const getHighlightedServices = () => {
  return serviceList.filter(service => service.highlighted);
};

// Exportamos el listado para uso en componentes
export default serviceList; 