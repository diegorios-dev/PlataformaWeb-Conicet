import { useState, useEffect } from "react";
import { getAllSites } from "../services/siteService";
import type { Site } from "../services/siteService";

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = async () => {
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
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return {
    sites,
    loading,
    error,
    refetch: fetchSites,
  };
};