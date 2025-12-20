import { httpGet } from "@shared/services";
import { getCachedData } from "@shared/utils/simpleCache";
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";

const MAESTROS_TTL = 10 * 60 * 1000; // 10 minutos (datos relativamente estables)

export interface Event {
  id: number;
  type: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Obtiene todos los eventos del sistema (con cache)
 * Cache: 10 minutos (datos relativamente estables)
 */
export const getAllEvents = async (): Promise<Event[]> => {
  return getCachedData(
    'maestros:events',
    async () => {
      try {
        const data = await httpGet(`/v1/events`);
        
        if (!Array.isArray(data)) {
          devLog.warn('Datos de eventos inválidos', data);
          return [];
        }
        
        return data;
      } catch (error) {
        devLog.error('Error obteniendo todos los eventos', error);
        throw new Error(getErrorMessage(error));
      }
    },
    MAESTROS_TTL
  );
};

export const getEventById = async (id: number): Promise<Event> => {
  try {
    const data = await httpGet(`/v1/events/${id}`);
    
    if (!data || typeof data !== 'object') {
      devLog.warn(`Evento ${id} no encontrado o inválido`, data);
      throw new Error('Evento no encontrado');
    }
    
    return data;
  } catch (error) {
    devLog.error(`Error obteniendo evento ${id}`, error);
    throw new Error(getErrorMessage(error));
  }
};
