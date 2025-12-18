import { useEffect , useState, useCallback} from "react";
import { getReportes, PaginatedReports, ReportsParams } from "@features/report/services";
import { devLog } from "@shared/utils/errorHandler";
import type { Report } from "@features/report/types";

const useReports = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Omit<PaginatedReports, 'data'> | null>(null);
    const [currentParams, setCurrentParams] = useState<ReportsParams>({ order: 'desc', page: 1, per_page: 15 });

    const fetchReports = useCallback(async (params: ReportsParams) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getReportes(params);
            
            // Handle paginated response
            if (response && 'data' in response && Array.isArray(response.data)) {
                setReports(response.data);
                const { data, ...paginationData } = response;
                setPagination(paginationData);
            } else if (Array.isArray(response)) {
                // Fallback for non-paginated response
                setReports(response);
                setPagination(null);
            } else {
                devLog.warn('Datos de reportes inválidos', response);
                setReports([]);
                setPagination(null);
            }
        } catch (error) {
            devLog.error('Error en useReports', error);
            setError('Error al cargar reportes');
            setReports([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports(currentParams);
    }, [fetchReports, currentParams]);

    const goToPage = useCallback((page: number) => {
        setCurrentParams(prev => ({ ...prev, page }));
    }, []);

    const changePerPage = useCallback((per_page: number) => {
        setCurrentParams(prev => ({ ...prev, per_page, page: 1 }));
    }, []);

    const changeOrder = useCallback((order: 'asc' | 'desc') => {
        setCurrentParams(prev => ({ ...prev, order }));
    }, []);
      
    return { 
        reports, 
        loading, 
        error, 
        pagination,
        currentParams,
        goToPage,
        changePerPage,
        changeOrder,
        refetch: () => fetchReports(currentParams)
    };
}

export default useReports;