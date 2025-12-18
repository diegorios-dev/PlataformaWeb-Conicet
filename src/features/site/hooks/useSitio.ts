import { useEffect, useState } from "react";
import { getSites } from "@features/site/services";
import { devLog } from "@shared/utils/errorHandler";
import type { Coord } from "@features/map/types/interfaces";

interface SitioState {
    sitios: Coord[];
    loading: boolean;
    error: string | null;
}

function useSitio (selectedInstrument : number | string | null) {

    const [state, setState] = useState<SitioState>({
        sitios: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        
        const fetchData = async () => {
            setState(prev => ({ ...prev, loading: true, error: null }));
            
            try {
                const data = await getSites(selectedInstrument);
                
                // Caso 1: No hay datos o respuesta vacía
                if (!data) {
                    setState({
                        sitios: [],
                        loading: false,
                        error: "No se recibieron datos del servidor"
                    });
                    return;
                }

                // Caso 2: Array vacío (no hay sitios para este instrumento)
                if (Array.isArray(data) && data.length === 0) {
                    setState({
                        sitios: [],
                        loading: false,
                        error: null // No es un error, simplemente no hay datos
                    });
                    return;
                }

                // Caso 3: Respuesta con datos - validar antes de mapear
                const objSitio: Coord[] = data
                    .filter((item: unknown) => {
                        const record = item as Record<string, unknown>;
                        const report = record?.report as Record<string, unknown> | undefined;
                        const site = report?.site as Record<string, unknown> | undefined;
                        return site?.latitude && 
                               site?.longitude &&
                               !isNaN(parseFloat(String(site.latitude))) &&
                               !isNaN(parseFloat(String(site.longitude)));
                    })
                    .map((item: unknown) => {
                        const record = item as Record<string, unknown>;
                        const report = record?.report as Record<string, unknown>;
                        const site = report?.site as Record<string, unknown>;
                        const unitedMeasure = record?.united_measure as Record<string, unknown> | undefined;
                        
                        return {
                            coordenadas: [
                                parseFloat(String(site.latitude)),
                                parseFloat(String(site.longitude)),
                            ] as [number, number],
                            cantidad: parseFloat(String(record.amount)) || 0,
                            idSitio: Number(site.id),
                            nombreSitio: String(site.nombre || ''),
                            tipo: String(unitedMeasure?.abbreviation || 'mm'),
                        };
                    });

                setState({
                    sitios: objSitio,
                    loading: false,
                    error: null
                });
                
            } catch (error: unknown) {
                
                devLog.error('Error en useSitio', error);
                
                // Caso 4: Determinar tipo de error
                let errorMessage = "Error desconocido al cargar los datos";
                
                const err = error as {response?: {status: number}, request?: unknown, message?: string};
                
                if (err.response) {
                    // Error de respuesta del servidor
                    if (err.response.status === 404) {
                        errorMessage = "No se encontraron datos para este instrumento";
                    } else if (err.response.status === 500) {
                        errorMessage = "Error en el servidor. Intenta más tarde";
                    } else if (err.response.status === 401 || err.response.status === 403) {
                        errorMessage = "No tienes permisos para acceder a estos datos";
                    } else {
                        errorMessage = `Error del servidor (${err.response.status})`;
                    }
                } else if (err.request) {
                    // La petición se hizo pero no hubo respuesta
                    errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión";
                } else {
                    // Error al configurar la petición
                    errorMessage = err.message || "Error al procesar la solicitud";
                }
                
                setState({
                    sitios: [],
                    loading: false,
                    error: errorMessage
                });
            }
        };
        
        fetchData();

    }, [selectedInstrument]);
    
    return state;
}

export default useSitio