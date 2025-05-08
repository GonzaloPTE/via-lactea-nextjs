import { getServiceBySlug } from "data/service-data";
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetailClient from "components/blocks/services/ServiceDetailClient";
import Script from 'next/script';

// Tipado para params
interface ServiceDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: ServiceDetailProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
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
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  // If service not found, trigger the 404 page
  if (!service) {
    notFound();
  }

  // --- INICIO: Lógica para Schema Service ---
  // Determinar serviceType (similar a generateMetadata)
  let serviceType = 'Asesoría de Sueño Infantil Respetuoso';
  if (service.title.toLowerCase().includes('lactancia')) {
    serviceType = 'Asesoría de Lactancia Materna';
  } else if (service.category === 'general') {
    serviceType = 'Consulta de Crianza'; // O término más adecuado
  }

  // Construir el objeto JSON-LD para Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description || service.shortDescription,
    "url": `https://vialacteasuenoylactancia.com/servicios/${service.slug}`,
    "provider": {
      "@type": "Organization",
      "@id": "https://vialacteasuenoylactancia.com/#organization" // Enlaza a la organización
    },
    "serviceType": serviceType,
    "areaServed": {
      "@type": "Country",
      "name": "ES" // Asumiendo España, ajustar si es global ("World") o múltiple
    },
    ...(service.price && { // Añadir 'offers' solo si hay precio
      "offers": {
        "@type": "Offer",
        "price": service.price.toString(),
        "priceCurrency": "EUR"
      }
    }),
    ...(service.heroImageUrl && { // Añadir 'image' solo si existe
       "image": `https://vialacteasuenoylactancia.com${service.heroImageUrl}` // Asegurar URL completa
    })
    // Podrías añadir más propiedades como "audience", "serviceOutput", etc.
  };
  // --- FIN: Lógica para Schema Service ---

  return (
    <>
      <ServiceDetailClient service={service} />

      {/* Schema.org Service */}
      <Script
        id={`service-schema-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
} 