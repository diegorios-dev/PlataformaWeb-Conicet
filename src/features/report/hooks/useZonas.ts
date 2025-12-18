import { useEffect, useState } from "react";
import { getAllZonas } from "@features/zone/services";
import type { Zona } from "@features/zone/types";

export const useZonas = () => {
  const [zonas, setZonas] = useState<Zona[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllZonas();
        setZonas(data);
      } catch (e) {
      }
    };
    load();
  }, []);

  return zonas;
};
