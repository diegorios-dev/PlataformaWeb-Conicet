import { useEffect, useState } from "react";
import { getSitio } from "../services/sitiosService";

function useSitio (selectedInstrument : any) {
    const [sitios, setSitios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            
            try {
                const data = await getSitio(selectedInstrument);
                
                const objSitio = data.map(item => ({
                    coordenadas: [
                        parseFloat(item.report.site.latitude),
                        parseFloat(item.report.site.longitude),
                    ],
                    cantidad: parseFloat(item.amount),
                    tipo: item.united_measure.abbreviation,
                }));

                setSitios(objSitio);

            } catch (error) {
                console.error("Error al traer precipitaciones:", error);
            }
        };
        
        fetchData();

    }, [selectedInstrument]);
    
    return sitios;
}

export default useSitio