import { API_URL } from "@config/api";
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";
import { 
  validateLatitude, 
  validateLongitude, 
  validatePositiveId,
  validateText 
} from "@shared/utils/validators";


export interface Site {
  id?: number;
  nombre: string;
  latitude: number;
  longitude: number;
  zona_id: string | number;
  event_id: string | number;
  cota?: string | number;
}

export interface SiteResponse {
  message?: string;
  data?: Site;
}

/**
 * Obtiene todos los sitios del sistema
 */
export const getAllSites = async (): Promise<Site[]> => {
  try {
    const response = await fetch(`${API_URL}/sitios`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      devLog.warn('Datos de sitios inválidos', data);
      return [];
    }
    
    return data;
  } catch (error) {
    devLog.error('Error obteniendo sitios', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Crea un nuevo sitio
 */
export const createSite = async (siteData: Site): Promise<SiteResponse> => {
  try {
    const response = await fetch(`${API_URL}/site`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      message: data?.message || "Sitio creado exitosamente",
      data,
    };
  } catch (error) {
    devLog.error('Error creando sitio', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Obtiene un sitio por su ID
 * Nota: El backend no tiene endpoint GET /sitios/{id}, por lo que obtenemos todos y filtramos
 */
export const getSiteById = async (siteId: number): Promise<Site> => {
  try {
    const allSites = await getAllSites();
    const site = allSites.find(s => s.id === siteId);
    
    if (!site) {
      throw new Error(`Sitio con ID ${siteId} no encontrado`);
    }
    
    return site;
  } catch (error) {
    devLog.error(`Error obteniendo sitio ${siteId}`, error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Actualiza un sitio existente
 */
export const updateSite = async (
  siteId: number,
  siteData: Partial<Site>
): Promise<SiteResponse> => {
  try {
    const response = await fetch(`${API_URL}/site/${siteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      message: data?.message || "Sitio actualizado exitosamente",
      data,
    };
  } catch (error) {
    devLog.error(`Error actualizando sitio ${siteId}`, error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Elimina un sitio
 */
export const deleteSite = async (siteId: number): Promise<SiteResponse> => {
  try {
    const response = await fetch(`${API_URL}/site/${siteId}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      message: data?.message || "Sitio eliminado exitosamente",
      data,
    };
  } catch (error) {
    devLog.error(`Error eliminando sitio ${siteId}`, error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Valida los datos de un sitio
 */
export const validateSiteData = (siteData: Partial<Site>): string | null => {
  // Validar nombre usando la función de validators
  const nombreError = validateText(siteData.nombre || '', 3, 100, 'El nombre del sitio');
  if (nombreError) return nombreError;
  
  // Validar latitud
  const latError = validateLatitude(siteData.latitude);
  if (latError) return latError;
  
  // Validar longitud
  const lngError = validateLongitude(siteData.longitude);
  if (lngError) return lngError;
  
  // Validar zona
  const zonaError = validatePositiveId(siteData.zona_id, 'La zona');
  if (zonaError) return zonaError;
  
  // Validar evento
  const eventoError = validatePositiveId(siteData.event_id, 'El evento');
  if (eventoError) return eventoError;
  
  // Validar cota si existe (es opcional)
  if (siteData.cota !== undefined && siteData.cota !== null && siteData.cota !== '') {
    const cota = Number(siteData.cota);
    if (isNaN(cota)) {
      return 'La cota debe ser un número válido';
    }
    if (cota < -500 || cota > 10000) {
      return 'La cota debe estar entre -500 y 10000 metros';
    }
  }
  
  return null;
};

