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