import axios from "axios";
import { API_URL } from "@config/api";

const API_URL_SERVICE = API_URL;

/**
 * Obtiene todos los instrumentos disponibles
 */
export const getAllInstruments = async () => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/instrumentos`);
    return data;
  } catch (error) {
    console.error("Error al obtener instrumentos:", error);
    throw error;
  }
};

/**
 * Obtiene los instrumentos asignados a un usuario específico
 */
export const getUserInstruments = async (userId: number) => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/usuario/${userId}/instrumentos`);
    return data;
  } catch (error) {
    console.error("Error al obtener instrumentos del usuario:", error);
    throw error;
  }
};

/**
 * Asigna un instrumento a un usuario
 */
export const assignInstrumentToUser = async (userId: number, instrumentId: number) => {
  try {
    const { data } = await axios.post(
      `${API_URL_SERVICE}/usuario/${userId}/instrumentos`,
      { instrument_id: instrumentId }
    );
    return data;
  } catch (error: any) {
    console.error("Error al asignar instrumento:", error);
    console.error("Respuesta del servidor:", error.response?.data);
    throw error;
  }
};

/**
 * Quita un instrumento de un usuario
 */
export const removeInstrumentFromUser = async (userId: number, instrumentId: number) => {
  try {
    const { data } = await axios.delete(
      `${API_URL_SERVICE}/usuario/${userId}/instrumentos/${instrumentId}`
    );
    return data;
  } catch (error: any) {
    console.error("Error al quitar instrumento:", error);
    console.error("Respuesta del servidor:", error.response?.data);
    throw error;
  }
};
