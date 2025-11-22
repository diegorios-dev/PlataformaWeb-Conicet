import { useState, useRef, useCallback } from "react";
import { useFetchData } from "../../../../hooks/useFetchData";


export function useHistograma(service) {

  const [periodo, setPeriodo] = useState("mes");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [pdfQuality, setPdfQuality] = useState(2);

  const chartRef = useRef(null);

  const fetchData = useCallback(() => {
    if (periodo === "dia") return service(periodo, year, month);
    return service(periodo, year, null);
  }, [periodo, year, month, service]);

  const { data, loading, error } = useFetchData(fetchData);

  return {
    periodo,
    setPeriodo,
    year,
    setYear,
    month,
    setMonth,
    pdfQuality,
    setPdfQuality,
    chartRef,
    data,
    loading,
    error
  };
}
