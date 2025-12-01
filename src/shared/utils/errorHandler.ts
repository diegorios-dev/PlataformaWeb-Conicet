/**
 * Utilidad simple para manejo de errores
 */

/**
 * Logger que solo muestra mensajes en desarrollo
 */
export const devLog = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(`[Error] ${message}`, error);
    }
  },
  
  warn: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.warn(`[Warning] ${message}`, data);
    }
  },
  
  info: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.info(`[Info] ${message}`, data);
    }
  }
};

/**
 * Obtiene un mensaje de error amigable
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Ha ocurrido un error inesperado';
}
