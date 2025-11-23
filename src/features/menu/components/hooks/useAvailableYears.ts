// src/hooks/useAvailableYears.ts
import { useEffect, useState } from "react";
import { getAvailableYears } from "@features/site/services";

export function useAvailableYears() {
  
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAvailableYears = async () => {
      try {
        const response = await getAvailableYears();
        let years: number[] = [];

        if (Array.isArray(response)) {
          years = response as number[];
        } else if (response && typeof response === "object" && "years" in response) {
          years = (response as any).years || [];
        }

        if (!mounted) return;

        setAvailableYears(years);
        if (years.length > 0) setSelectedYear(years[0]);
      } catch (error) {
        if (!mounted) return;
        const currentYear = new Date().getFullYear();
        const fallbackYears: number[] = [];
        for (let year = 2014; year <= currentYear; year++) fallbackYears.push(year);
        setAvailableYears(fallbackYears);
        setSelectedYear(fallbackYears[fallbackYears.length - 1] ?? null);
      }
    };

    fetchAvailableYears();

    return () => {
      mounted = false;
    };
  }, []);

  return { availableYears, selectedYear, setSelectedYear };
}
