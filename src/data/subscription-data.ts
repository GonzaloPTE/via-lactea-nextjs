import IconProps from 'types/icon';

// --- Placeholder Icons (replace with actual icons if needed) ---
import Medal from 'icons/lineal/Medal';
import LightBulb from 'icons/lineal/LightBulb';
import ClockThree from 'icons/lineal/ClockThree';
import CheckList from 'icons/lineal/CheckList';

// --- Icon URLs (using placeholders, adjust paths as necessary) ---
const ICON_PATH_SOLID = '/img/icons/solid/';
const ICON_PATH_LINEAL = '/img/icons/lineal/'; // Added path for lineal icons
const iconUrls = {
  subscription: `${ICON_PATH_LINEAL}loyalty.svg`, // Changed to lineal loyalty icon
};

// --- Subscription Interval Type ---
type SubscriptionInterval = 'month' | 'year'; // Add other intervals if needed

// --- SubscriptionItem Interface ---
export interface SubscriptionItem {
  id: number;
  title: string;
  slug: string; // Unique identifier for the subscription plan
  description: string;
  shortDescription: string;
  iconUrl: string;
  heroImageUrl?: string; // Optional hero image for a potential subscription page
  price: number; // Price per interval
  currency: string; // e.g., 'eur', 'usd'
  interval: SubscriptionInterval; // Billing interval (e.g., 'month')
  benefits: {
    id: number;
    title: string;
    featureIcon: React.FC<IconProps>;
    description: string;
  }[];
  color?: string; // Optional color for styling
  highlighted?: boolean; // Flag if it should be highlighted in UI
  // Add other fields as needed, e.g., trial period days, specific included features
}

// --- Subscription List ---
export const subscriptionList: SubscriptionItem[] = [
  {
    id: 101, // Unique ID for the subscription
    title: 'Suscripción Mensual Vía Láctea',
    slug: 'suscripcion-mensual', // Crucial for identifying in the script
    description: 'Acceso completo e ilimitado a todos nuestros recursos premium: guías, módulos, cursos, infografías y contenido exclusivo añadido regularmente. La mejor forma de mantenerte al día y tener apoyo continuo.',
    shortDescription: 'Acceso ilimitado a todo el contenido premium por 10€/mes.',
    iconUrl: iconUrls.subscription, // This will now use the loyalty icon path
    heroImageUrl: '/img/via-lactea/illustrations/subscription-hero.png',
    price: 10,
    currency: 'eur',
    interval: 'month',
    benefits: [
      {
        id: 1,
        title: 'Acceso Total al Contenido',
        featureIcon: CheckList,
        description: 'Disfruta sin límites de todas las guías, cursos, módulos y recursos publicados.'
      },
      {
        id: 2,
        title: 'Contenido Nuevo Regularmente',
        featureIcon: ClockThree,
        description: 'Recibe automáticamente todos los nuevos recursos que añadamos a la plataforma.'
      },
      {
        id: 3,
        title: 'Material Exclusivo',
        featureIcon: LightBulb,
        description: 'Accede a contenido y materiales disponibles únicamente para suscriptores.'
      },
      {
        id: 4,
        title: 'Apoyo Continuo',
        featureIcon: Medal, // Placeholder icon
        description: 'La tranquilidad de tener siempre a mano información fiable y actualizada.'
      }
    ],
    color: 'grape', // Theme color
    highlighted: true,
  },
  // Add other subscription plans here if needed (e.g., annual)
];

// --- Helper Functions (optional, if needed later) ---

export const getSubscriptionBySlug = (slug: string): SubscriptionItem | undefined => {
  return subscriptionList.find(sub => sub.slug === slug);
};

export default subscriptionList;
