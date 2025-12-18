import { useState, useMemo } from "react";
import type { Site } from "../services";

export const useSiteFilters = (sites: Site[]) => {

  const [search, setSearch] = useState("");
  const [filterZona, setFilterZona] = useState<string>("all");

  const filteredSites = useMemo(() => {
    let result = [...sites];

    // Filtrar por zona
    if (filterZona !== "all") {
      result = result.filter((s) => s.zona_id?.toString() === filterZona);
    }

    // Filtrar por búsqueda
    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.nombre?.toLowerCase().includes(searchLower) ||
          s.latitude?.toString().includes(search) ||
          s.longitude?.toString().includes(search)
      );
    }

    return result;
  }, [sites, search, filterZona]);

  return {
    search,
    setSearch,
    filterZona,
    setFilterZona,
    filteredSites,
  };
};