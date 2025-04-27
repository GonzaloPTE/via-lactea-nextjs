import { MetadataRoute } from 'next';
import { serviceList, type ServiceItem } from '../data/service-data'; // Correct import path and add type import

const BASE_URL = 'https://vialacteasuenoylactancia.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only include static routes visible in main navigation
  const staticRoutes = [
    '/', // Inicio
    '/servicios', // Tarifas
    // Removed: '/sobre-mi', '/blog', '/contacto' as they are commented out in navigation
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: (route === '/' ? 'yearly' : 'monthly') as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: route === '/' ? 1 : 0.8,
  }));

  // Generate dynamic routes for services
  const serviceRoutes = serviceList.map((service: ServiceItem) => ({
    url: `${BASE_URL}/servicios/${service.slug}`,
    lastModified: new Date().toISOString(), // Consider using a real last modified date if available
    changeFrequency: 'monthly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: 0.7,
  }));

  // Ejemplo: Añadir URLs dinámicas (ej. posts de blog)
  // Deberías obtener estos datos de tu CMS, base de datos, o donde los almacenes
  // const posts = await getAllPublishedBlogPostSlugs(); // Función imaginaria
  // const dynamicPostRoutes = posts.map((post) => ({
  //   url: `${BASE_URL}/blog/${post.slug}`,
  //   lastModified: post.updatedAt, // Usa la fecha real de actualización
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }));

  return [
    ...staticRoutes,
    ...serviceRoutes, // Add service routes
    // ...dynamicPostRoutes, // Descomenta y adapta si tienes rutas dinámicas de blog
  ];
} 