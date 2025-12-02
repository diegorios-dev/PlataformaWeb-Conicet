// Tipos básicos para sitios

export interface Site {
  id: number;
  nombre: string;
  latitude: number;
  longitude: number;
  zona_id: number;
  event_id: number;
  zona?: {
    id: number;
    locality: string;
  };
}

export interface SiteFormData {
  nombre: string;
  latitude: string | number;
  longitude: string | number;
  zona_id: string | number;
  event_id: string | number;
}
