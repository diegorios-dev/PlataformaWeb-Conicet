export interface Zona {
  id: number;
  locality: string;
}

export interface Usuario {
  id: number;
  name: string;
}

export interface ImportResult {
  insertadas?: number;
  actualizadas?: number;
  insertados?: number;
  actualizados?: number;
  errores?: number;
}

export interface ImportResponse {
  success: boolean;
  message: string;
  resultados: {
    zonas: ImportResult;
    sitios: ImportResult;
    usuarios: ImportResult;
    instrumentos_usuarios: ImportResult;
  };
}