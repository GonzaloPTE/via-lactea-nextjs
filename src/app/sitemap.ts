import { MetadataRoute } from 'next';
import { serviceList, type ServiceItem } from '../data/service-data'; // Correct import path and add type import
import { 
  getAllUniqueCategories, 
  getAllUniqueTags, 
  getAllPublishedPostSlugsAndDates 
} from '../lib/data/blog'; // Import blog data functions from new provider
import { slugify } from '../lib/utils'; // Import slugify

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://vialacteasuenoylactancia.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Only include static routes visible in main navigation
  const staticRoutes = [
    '/', // Inicio
    '/servicios', // Tarifas
    '/blog', // Blog
    '/blog/categorias', // Categorías
    '/blog/tags', // Tags
    // Removed: '/sobre-mi', '/contacto' as they are commented out in navigation
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

  // Generate dynamic routes for blog posts
  const postsData = await getAllPublishedPostSlugsAndDates();
  const dynamicPostRoutes = postsData.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'weekly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: 0.7,
  }));

  // Generate dynamic routes for blog categories
  const categories = await getAllUniqueCategories();
  const dynamicCategoryRoutes = categories.map((categoryName) => ({
    url: `${BASE_URL}/blog/categorias/${slugify(categoryName)}`,
    lastModified: currentDate, // Categories pages update less frequently or when content changes
    changeFrequency: 'monthly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: 0.6,
  }));

  // Generate dynamic routes for blog tags
  const tags = await getAllUniqueTags();
  const dynamicTagRoutes = tags.map((tagName) => ({
    url: `${BASE_URL}/blog/tags/${slugify(tagName)}`,
    lastModified: currentDate, // Tags pages update less frequently or when content changes
    changeFrequency: 'monthly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes, // Add service routes
    ...dynamicPostRoutes, 
    ...dynamicCategoryRoutes,
    ...dynamicTagRoutes,
  ];
} 