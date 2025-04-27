import { getServiceBySlug } from "data/service-data";
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

// Import the new client component
import ServiceDetailClient from "components/blocks/services/ServiceDetailClient"; // Adjust path as needed

// Tipado para params
interface ServiceDetailProps {
  params: { slug: string };
}

// Dynamic Metadata Generation
type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await params as suggested by the error message
  const resolvedParamsMeta = await params;
  const slug = resolvedParamsMeta.slug;
  const service = getServiceBySlug(slug);

  if (!service) {
    // Metadata for not found page can be handled globally or here
    // For consistency, we might let notFound() handle the page itself
    // and set generic metadata perhaps in layout.tsx or a global not-found.tsx
    return {
      title: "Servicio no encontrado | Vía Láctea",
    };
  }

  // Determine "tipo" based on category or title
  let tipo = 'Sueño Infantil respetuoso'; // Default
  if (service.title.toLowerCase().includes('lactancia')) {
    tipo = 'Lactancia';
  } else if (service.category === 'general') {
    tipo = 'consulta'; // Or another appropriate term
  }

  const title = `${service.title} | Asesoría de ${tipo} | Vía Láctea`;
  const description = service.shortDescription || `Consulta nuestra asesoría ${tipo} de Vía Láctea: ${service.title}. Ayuda profesional y personalizada.`;

  // Generate keywords dynamically
  const keywords = [
    service.title,
    `asesoría ${tipo.toLowerCase()}`,
    `ayuda ${tipo.toLowerCase()}`,
    service.categoryLabel,
    'Vía Láctea',
    'Miriam Rubio', // Assuming this is the author/brand name
    // Add more specific keywords based on service features or target audience if needed
    ...(service.features ? service.features.map(f => f.title.toLowerCase()) : []),
  ];

  return {
    title: title,
    description: description,
    keywords: keywords,
  };
}

// Default export is now a Server Component
export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  // Await params as suggested by the error message
  const resolvedParamsPage = await params;
  const { slug } = resolvedParamsPage;
  const service = getServiceBySlug(slug);

  // If service not found, trigger the 404 page
  if (!service) {
    notFound();
  }

  // Render the Client Component, passing the fetched service data
  return <ServiceDetailClient service={service} />;
} 