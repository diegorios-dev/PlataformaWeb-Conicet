import { useState, useEffect, useCallback } from "react";
import { getAllSites } from "../services";
import type { Site } from "../services";

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ OPTIMIZACIÓN: Memoizar fetchSites con useCallback
  const fetchSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSites();
      setSites(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  return {
    sites,
    loading,
    error,
    refetch: fetchSites,
  };
};