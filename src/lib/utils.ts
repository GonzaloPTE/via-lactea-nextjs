/**
 * Converts a string into a URL-friendly slug.
 * Handles spaces, diacritics, and removes non-alphanumeric characters (except hyphens).
 * @param text The string to slugify.
 * @returns The slugified string.
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize diacritics (e.g., é -> e + ´)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^Ѐ-ӿ\w\-]+/g, '') // Remove all non-word chars and non-cyrillic. Cyrillic is included just in case.
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// Nueva función para procesar contenido HTML de posts
export function processPostHtmlContent(htmlString: string | null | undefined): string {
  if (!htmlString) return '';

  // Regex para encontrar etiquetas <a> con atributo href
  // Captura:
  // 1. beforeHref: Contenido antes del atributo href (ej. otros atributos)
  // 2. quote: Comillas usadas para el valor de href (' o ")
  // 3. url: El valor del atributo href
  // 4. afterHref: Contenido después del atributo href (ej. otros atributos)
  const regex = /<a([^>]*?)href=(["'])(.*?)\2([^>]*?)>/gi;

  return htmlString.replace(regex, (match, beforeHref, quote, url, afterHref) => {
    const cleanedUrl = url.trim(); // Limpiar espacios en la URL

    // Lista de protocolos/prefijos a ignorar (ya completos, relativos, o anclas)
    const ignorePrefixes = ['http://', 'https://', 'mailto:', 'tel:', 'ftp:', '/', '#'];
    
    if (ignorePrefixes.some(prefix => cleanedUrl.startsWith(prefix))) {
      return match; // No necesita cambios, ya es un enlace completo, relativo o ancla
    }
    
    // Si la URL no tiene un protocolo conocido y no es relativa/ancla,
    // se asume que es un enlace externo al que le falta el esquema.
    // Ejemplos: "example.com", "www.example.com/path"
    const newUrl = `https://${cleanedUrl}`;
    return `<a${beforeHref}href=${quote}${newUrl}${quote}${afterHref}>`;
  });
} 