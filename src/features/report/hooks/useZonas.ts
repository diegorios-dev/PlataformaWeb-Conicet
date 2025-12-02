import { useEffect, useState } from "react";
import { getAllZonas } from "@features/zona/services";
import type { Zona } from "@features/zona/types";

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
