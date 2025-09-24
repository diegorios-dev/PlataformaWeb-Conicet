import axios from "axios";

export interface Zona {
  id: number;
  locality: string;
  created_at: string;
  updated_at: string;
}

export interface PrecipitacionTipo {
  id: number;
  type: string;
  created_at: string;
  updated_at: string;
}

export type Precipitacion = {
  id: number;
  latitude: string;
  longitude: string;
  zona_id: number;
  precipitacion_id: number;
  created_at: string;
  updated_at: string;
  zona: Zona;
  precipitacion: PrecipitacionTipo;
}

const API_URL = "http://localhost:8000/api";

export const getPrecipitaciones = async (): Promise<Precipitacion[]> => {
  const { data } = await axios.get<Precipitacion[]>(`${API_URL}/sitios`);
  return data;
};