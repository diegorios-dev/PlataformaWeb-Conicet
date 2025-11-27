import { useEffect, useState } from "react";
import { detectErrorType } from "@shared/ui/Loading/ErrorState";

export const useFetchData = (fetchFunction) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);
        
        const response = await fetchFunction();
        setData(response);
      } catch (err) {
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
