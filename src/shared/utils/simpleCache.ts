/**
 * Sistema de cache simple en memoria con TTL
 * Mantiene datos en memoria para evitar llamadas repetidas al servidor
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en milisegundos
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Guardar datos en cache
   * @param key - Identificador único del dato
   * @param data - Datos a guardar
   * @param ttl - Tiempo de vida en milisegundos (default: 5 minutos)
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Obtener datos del cache si no han expirado
   * @param key - Identificador del dato
   * @returns Datos si existen y no han expirado, null en caso contrario
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Invalidar (eliminar) una entrada específica del cache
   * @param key - Identificador del dato a invalidar
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidar múltiples entradas que coincidan con un patrón
   * @param pattern - Patrón de búsqueda (usa includes)
   */
  invalidatePattern(pattern: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Limpiar todo el cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtener el tamaño actual del cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Exportar instancia única (singleton)
export const cache = new SimpleCache();

/**
 * Helper para usar cache con funciones async
 * @param key - Clave del cache
 * @param fetchFn - Función que obtiene los datos
 * @param ttl - Tiempo de vida del cache (default: 5 minutos)
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Intentar obtener del cache
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Si no está en cache, obtener datos
  const data = await fetchFn();
  
  // Guardar en cache
  cache.set(key, data, ttl);
  
  return data;
}
