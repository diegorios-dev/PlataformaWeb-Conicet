import { useEffect , useState} from "react";
import { getReportes } from "@features/report/services";

const useReports = () => {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Obtener sin orden, se ordenará en el frontend
            const data = await getReportes('asc');
            setReports(data);
        };
    
        fetchData();
    }, []);
      
    return reports;
}

export default useReports