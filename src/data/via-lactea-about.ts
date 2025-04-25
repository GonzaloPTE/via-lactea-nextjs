import Medal from 'icons/lineal/Medal';
import Team from 'icons/lineal/Team';
import IdCard from 'icons/lineal/IdCard';
import Shield from 'icons/lineal/Shield';

interface StatItem {
  id: number;
  value: number | string;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
}

// Lista en formato correcto para ListColumn (array de arrays de strings)
export const aboutMiriamList: string[][] = [
  [
    'Asesora del sueño infantil respetuoso certificada por el método Conecta',
    'Asesora de lactancia certificada',
    'Enfermera con más de 15 años de experiencia',
    'Madre comprometida con la crianza respetuosa'
  ],
  [
    'Formación continua en desarrollo infantil',
    'Especialista en descanso familiar',
    'Acompañamiento personalizado para cada familia',
    'Enfoque respetuoso con las necesidades del bebé'
  ]
];

// Datos para la sección de Facts5
export const miriamStats: StatItem[] = [
  {
    id: 1,
    value: "Sueño",
    title: 'Certificada en Sueño Infantil Respetuoso - Método Conecta',
    Icon: Shield
  },
  {
    id: 2,
    value: "Lactancia",
    title: 'Certificada como Asesora de Lactancia',
    Icon: IdCard
  },
  {
    id: 3,
    value: "15+",
    title: 'Años de experiencia acompañando familias',
    Icon: Medal
  },
  {
    id: 4,
    value: "90+",
    title: 'Familias ayudadas ¿A qué esperas?',
    Icon: Team
  }
]; 