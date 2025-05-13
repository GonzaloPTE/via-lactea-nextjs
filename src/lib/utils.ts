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

/**
 * Generates a deterministic date for a blog post based on its ID.
 * The date will be within the range of January 1, 2024, to May 13, 2025.
 * @param postId The ID of the post, used to ensure determinism.
 * @returns A Date object representing the generated date.
 */
export function generateDeterministicPostDate(postId: number): Date {
  const startDateMs = new Date('2024-01-01T00:00:00.000Z').getTime();
  const endDateMs = new Date('2025-05-13T23:59:59.999Z').getTime();
  const rangeInMilliseconds = endDateMs - startDateMs;

  // Generate a 32-bit hash
  let hash = postId;
  // A common way to mix bits (variant of xorshift* / MurmurHash finalizer style)
  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
  hash = hash ^ (hash >>> 16);

  // Convert to an unsigned 32-bit integer for normalization
  const unsignedHash = hash >>> 0; // This gives a value between 0 and 0xFFFFFFFF (4,294,967,295)

  // Normalize the hash to a value between 0 (inclusive) and 1 (exclusive)
  // Math.pow(2, 32) is 0x100000000
  const normalizedValue = unsignedHash / Math.pow(2, 32);

  // Scale this normalized value to the desired range
  // Math.floor ensures we get an integer offset within the range
  const deterministicOffset = Math.floor(normalizedValue * rangeInMilliseconds);

  const generatedTimestamp = startDateMs + deterministicOffset;
  
  return new Date(generatedTimestamp);
} 