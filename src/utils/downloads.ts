/**
 * Calcula el número de descargas basado en la fecha de publicación
 * Utiliza un algoritmo que incrementa las descargas con el tiempo
 * @param publishDate Fecha de publicación en formato ISO string
 * @returns Número de descargas calculado
 */
export const calculateDownloads = (publishDate: string): number => {
  const pubDate = new Date(publishDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - pubDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Algoritmo simple: base + (días * factor aleatorio)
  const base = 50;
  const dailyFactor = 2 + Math.random() * 3; // Entre 2 y 5 descargas por día
  
  return Math.floor(base + (diffDays * dailyFactor));
}; 