export interface Site {
  id: number;
  nombre: string;
  latitude: number;
  longitude: number;
  zona_id: number | string;
  event_id: number | string;
  cota?: string | number;
  status?: boolean;
  tiene_instrumentos_averiados?: boolean;
  instrumentos_averiados?: unknown[];
  zona?: {
    id: number;
    locality: string;
  };
  event?: {
    id: number;
    type: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface SiteFormData {
  nombre: string;
  latitude: string | number;
  longitude: string | number;
  zona_id: string | number;
  event_id: string | number;
  cota?: string | number;
}
