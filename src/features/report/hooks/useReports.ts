import { useEffect , useState} from "react";
import { getReportes } from "@features/report/services";
import { devLog } from "@shared/utils/errorHandler";
import type { Report } from "@features/report/types";

const useReports = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                // Obtener sin orden, se ordenará en el frontend
            const data = await getReportes('asc');
                
                if (!Array.isArray(data)) {
                    devLog.warn('Datos de reportes inválidos', data);
                    setReports([]);
                    return;
                }
                
                setReports(data);
            } catch (error) {
                devLog.error('Error en useReports', error);
                setError('Error al cargar reportes');
                setReports([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
      
    return { reports, loading, error };
}

export default useReports;