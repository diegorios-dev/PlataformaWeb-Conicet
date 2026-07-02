import { useState, useRef, useCallback } from "react";
import { useFetchData } from "@shared/hooks";

type HistogramDataPoint = {
  label: string;
  value: number;
};

type HistogramaService = (periodo: string, year: number, month: number | null) => Promise<HistogramDataPoint[]> | HistogramDataPoint[];

export function useHistograma(service: HistogramaService) {

  const [periodo, setPeriodo] = useState("mes");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [pdfQuality, setPdfQuality] = useState(2);

  const chartRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(() => {
    if (periodo === "dia") return Promise.resolve(service(periodo, year, month));
    return Promise.resolve(service(periodo, year, null));
  }, [periodo, year, month, service]);

  const { data, loading, error } = useFetchData<HistogramDataPoint[]>(fetchData);

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
    data: data ?? [],
    loading,
    error
  };
}
