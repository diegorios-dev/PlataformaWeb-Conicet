/**
 * Utilidades para construir URLs de recursos (imágenes, audios, etc.)
 * El backend devuelve rutas relativas como /storage/uploads/img_123.jpg
 * El frontend concatena con la base del API para obtener la URL completa
 */

// 🔧 CONFIGURACIÓN: Cambiar según el entorno
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💻 Development (localhost):
const API_BASE = "http://localhost:8000";

// 🌐 LAN (otros dispositivos en tu red):
// const API_BASE = "http://192.168.1.36:8000";

// 🚀 Production:
// const API_BASE = "https://api.produccion.com";
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Construye la URL completa de un recurso a partir de su path relativo
 * @param relativePath - Ruta relativa devuelta por el backend (ej: /storage/uploads/img_123.jpg)
 * @returns URL completa (ej: http://localhost:8000/storage/uploads/img_123.jpg)
 * 
 * @example
 * // Backend responde: { image: "/storage/uploads/img_123.jpg" }
 * buildResourceUrl("/storage/uploads/img_123.jpg")
 * // → "http://localhost:8000/storage/uploads/img_123.jpg"
 */
export const buildResourceUrl = (relativePath: string | null | undefined): string => {
  if (!relativePath) return "";
  
  // Si ya es una URL completa (http/https), devolverla tal cual
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }
  
  // Asegurar que el path empieza con /
  const normalizedPath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  
  return `${API_BASE}${normalizedPath}`;
};

/**
 * Construye URL de imagen
 * @param imagePath - Path relativo de la imagen
 * @returns URL completa de la imagen
 */
export const buildImageUrl = (imagePath: string | null | undefined): string => {
  return buildResourceUrl(imagePath);
};

/**
 * Construye URL de audio
 * @param audioPath - Path relativo del audio
 * @returns URL completa del audio
 */
export const buildAudioUrl = (audioPath: string | null | undefined): string => {
  return buildResourceUrl(audioPath);
};
