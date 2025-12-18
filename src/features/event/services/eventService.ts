import { httpGet, httpPost, httpPut, httpDelete } from "@shared/services";
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";

export interface Event {
  id: number;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export const getAllEvents = async (): Promise<Event[]> => {
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
