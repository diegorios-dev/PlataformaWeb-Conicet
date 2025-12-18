import { httpGet, httpPost, httpDelete } from "@shared/services";

/**
 * Obtiene todos los instrumentos disponibles
 */
export const getAllInstruments = async () => {
  try {
    const data = await httpGet(`/v1/instruments`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene los instrumentos asignados a un usuario específico
 */
export const getUserInstruments = async (userId: number) => {
  try {
    const data = await httpGet(`/v1/users/${userId}/instruments`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Asigna un instrumento a un usuario
 */
export const assignInstrumentToUser = async (userId: number, instrumentId: number) => {
  try {
    const data = await httpPost(
      `/v1/users/${userId}/instruments`,
      { instrument_id: instrumentId }
    );
    return data;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Quita un instrumento de un usuario
 */
export const removeInstrumentFromUser = async (userId: number, instrumentId: number) => {
  try {
    const data = await httpDelete(
      `/v1/users/${userId}/instruments/${instrumentId}`
    );
    return data;
  } catch (error: unknown) {
    throw error;
  }
};
