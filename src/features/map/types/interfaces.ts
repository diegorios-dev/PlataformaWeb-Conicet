// src/types.ts
export interface Coord {
  coordenadas: [number, number];
  cantidad: number;
  tipo: string;
  idSitio: number;
  nombreSitio?: string;
}

export interface MapHTMLProps {
  position: Coord[];
  loading?: boolean;
  error?: any;
}

export interface SiteData {
  totalAmount: number;
  lastReportAmount: number;
  lastReportDate: string | null;
}

export interface InstrumentoAveriado {
  instrument_id: number;
  instrument_name: string;
  description: string;
  last_breakage_date: string;
  cantidad_reportes_rotura: number;
}

export interface SiteStatus {
  status: boolean;
  tiene_instrumentos_averiados: boolean;
  instrumentos_averiados: InstrumentoAveriado[];
}
