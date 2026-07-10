import {API_URL} from "@config/api"

export interface ResolveRoturaResponse {
  message: string;
  data?: any;
}

export interface ResolveRoturaError {
  message: string;
  status?: number;
}

/**
 * Resuelve (elimina) un reporte de rotura
 * @param breakageInstrumentId - ID del instrumento de rotura (hijo)
 * @returns Promise con la respuesta del servidor
 */
export const resolveRoturaReport = async ( breakageInstrumentId: number): Promise<ResolveRoturaResponse> => {

  try {
    const response = await fetch(`${API_URL}/breakage-reports/${breakageInstrumentId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return {
      message: data?.message || "Reporte de rotura resuelto exitosamente",
      data: data,
    };
  } catch (error: unknown) {
    const err = error as {response?: {data?: {message?: string}, status?: number}, message?: string};
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Error al resolver el reporte de rotura";
    
    throw {
      message: errorMessage,
      status: err.response?.status,
    } as ResolveRoturaError;
  }
};

/**
 * Valida que el reporte tenga la información necesaria para resolver la rotura
 */
export const validateRoturaReport = (report: any): boolean => {
  return !!(
    report &&
    report.id &&
    report.breakage_instrument &&
    report.breakage_instrument.id
  );
};