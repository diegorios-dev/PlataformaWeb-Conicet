import { API_URL } from "@config/api";


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
      throw new Error("Error HTTP: " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Error al obtener los sitios"
    );
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
      throw new Error(errorData?.message || "Error al crear el sitio");
    }
    const data = await response.json();
    return {
      message: data?.message || "Sitio creado exitosamente",
      data,
    };
  } catch (error: any) {
    throw new Error(
      error?.message || "Error al crear el sitio"
    );
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
      throw new Error(errorData?.message || "Error al actualizar el sitio");
    }
    const data = await response.json();
    return {
      message: data?.message || "Sitio actualizado exitosamente",
      data,
    };
  } catch (error: any) {
    throw new Error(
      error?.message || "Error al actualizar el sitio"
    );
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
      throw new Error(errorData?.message || "Error al eliminar el sitio");
    }
    const data = await response.json();
    return {
      message: data?.message || "Sitio eliminado exitosamente",
      data,
    };
  } catch (error: any) {
    throw new Error(
      error?.message || "Error al eliminar el sitio"
    );
  }
};

/**
 * Valida los datos de un sitio
 */
export const validateSiteData = (siteData: Partial<Site>): string | null => {
  if (!siteData.nombre || siteData.nombre.trim() === "") {
    return "El nombre del sitio es requerido";
  }
  if (!siteData.latitude || isNaN(Number(siteData.latitude))) {
    return "La latitud debe ser un número válido";
  }
  if (!siteData.longitude || isNaN(Number(siteData.longitude))) {
    return "La longitud debe ser un número válido";
  }
  if (!siteData.zona_id) {
    return "La zona es requerida";
  }
  if (!siteData.event_id) {
    return "El evento es requerido";
  }
  return null;
};

