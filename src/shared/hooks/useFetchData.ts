import { useEffect, useState } from "react";
import { detectErrorType } from "@shared/ui/Loading/ErrorState";
import { devLog } from "@shared/utils/errorHandler";

export const useFetchData = <TData,>(fetchFunction: () => Promise<TData>) => {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [errorType, setErrorType] = useState<ReturnType<typeof detectErrorType> | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);
        
        const response = await fetchFunction();
        setData(response);
      } catch (err) {
        devLog.error('Error en useFetchData', err);
        const type = detectErrorType(err);
        setErrorType(type);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [fetchFunction]);

  return { data, loading, error, errorType };
};
