import { useEffect , useState} from "react";
import { getReportes } from "@features/report/services";

interface UseReportsOptions {
  order?: 'asc' | 'desc';
}

const useReports = (options: UseReportsOptions = {}) => {
    const { order = 'asc' } = options;
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        
        const fetchData = async () => {
            const data = await getReportes(order);
            setReports(data);
        };
    
    fetchData();
    }, [order]);
      
    return(reports)
}

export default useReports