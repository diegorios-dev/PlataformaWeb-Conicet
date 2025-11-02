import { useEffect, useState } from "react";
import { getSitio } from "../services/sitiosService";

interface SitioState {
    sitios: any[];
    loading: boolean;
    error: string | null;
}

function useSitio (selectedInstrument : any) {

    const [state, setState] = useState<SitioState>({
        sitios: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        
        const fetchData = async () => {
            setState(prev => ({ ...prev, loading: true, error: null }));
            
            try {
                const data = await getSitio(selectedInstrument);
                
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

                // Caso 3: Respuesta con datos
                const objSitio = data.map((item: any) => ({
                    coordenadas: [
                        parseFloat(item.report.site.latitude),
                        parseFloat(item.report.site.longitude),
                    ],
                    cantidad: parseFloat(item.amount),
                    idSitio: item.report.site.id,
                    tipo: item.united_measure.abbreviation,
                }));

                setState({
                    sitios: objSitio,
                    loading: false,
                    error: null
                });
            } catch (error: any) {
                console.error("Error al traer precipitaciones:", error);
                
                // Caso 4: Determinar tipo de error
                let errorMessage = "Error desconocido al cargar los datos";
                
                if (error.response) {
                    // Error de respuesta del servidor
                    if (error.response.status === 404) {
                        errorMessage = "No se encontraron datos para este instrumento";
                    } else if (error.response.status === 500) {
                        errorMessage = "Error en el servidor. Intenta más tarde";
                    } else if (error.response.status === 401 || error.response.status === 403) {
                        errorMessage = "No tienes permisos para acceder a estos datos";
                    } else {
                        errorMessage = `Error del servidor (${error.response.status})`;
                    }
                } else if (error.request) {
                    // La petición se hizo pero no hubo respuesta
                    errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión";
                } else {
                    // Error al configurar la petición
                    errorMessage = error.message || "Error al procesar la solicitud";
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