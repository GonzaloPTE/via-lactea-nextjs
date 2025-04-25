// Importar los iconos necesarios (todos de solid-mono)
import VideoChat from 'icons/solid-mono/VideoChat';
import VideoCall from 'icons/solid-mono/VideoCall';
import Headphone from 'icons/solid-mono/Headphone';
import Bulb from 'icons/solid-mono/Bulb';
import Alarm from 'icons/solid-mono/Alarm';
import Team from 'icons/solid-mono/Team';
import TeamTwo from 'icons/solid-mono/TeamTwo';
import Verify from 'icons/solid-mono/Verify';

// Lista de servicios de Vía Láctea
export const serviceList = [
  {
    id: 1,
    url: '/valoracion',
    Icon: Verify,
    title: 'Valoración gratuita',
    description: '¿No sabes por dónde empezar? Agenda una valoración gratuita y descubre cómo puedo ayudarte a ti y a tu bebé.'
  },
  {
    id: 2,
    url: '/lactancia',
    Icon: VideoChat,
    title: 'Para "0-6 meses"',
    description: 'Asesoría de Lactancia, Padres Primerizos y Alimentación. Te acompaño en el camino de la lactancia y acompañamiento a la madre o cuidador principal.'
  },
  {
    id: 3,
    url: '/enana-blanca',
    Icon: Bulb,
    title: 'Plan Enana Blanca',
    description: 'Un plan de sueño adaptado a tu familia para un descanso reparador. Ideal para niños de 6 meses a 4 años que buscan un cambio efectivo.'
  },
  {
    id: 4,
    url: '/gigante-roja',
    Icon: TeamTwo,
    title: 'Plan Gigante Roja',
    description: 'Un plan de sueño adaptado a tu familia, con pautas iniciales y seguimiento. Para niños de 6 meses a 4 años.'
  },
  {
    id: 5,
    url: '/semana-extra',
    Icon: Alarm,
    title: 'Semana extra de seguimiento',
    description: '¿Necesitas un poco más de tiempo? Añade una semana extra de soporte a tu asesoría y asegúrate de que todo va bien.'
  },
  {
    id: 6,
    url: '/llamada-sos',
    Icon: Headphone,
    title: 'Llamada SOS',
    description: '¿Eres nuevo en esto? Reserva una llamada SOS de 30 minutos y aclara tus dudas sobre el sueño y la lactancia.'
  },
  {
    id: 7,
    url: '/consulta-puntual',
    Icon: VideoCall,
    title: 'Consulta de Asesoría puntual',
    description: 'Consulta puntual de hasta 60min para resolver dudas urgentes. Ideal para quienes buscan respuestas rápidas y efectivas.'
  },
  {
    id: 8,
    url: '/suscripcion',
    Icon: Team,
    title: 'Suscripción Vía Láctea',
    description: 'Únete a nuestros webinars y talleres grupales, donde aprenderás estrategias efectivas para mejorar el sueño de tu bebé y resolver dudas comunes.'
  }
]; 