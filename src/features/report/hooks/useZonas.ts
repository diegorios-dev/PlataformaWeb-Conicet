import { useEffect, useState } from "react";
import { getAllZonas } from "@features/zona/services";

export const useZonas = () => {
  const [zonas, setZonas] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllZonas();
        setZonas(data);
      } catch (e) {
        console.error("Error cargando zonas:", e);
      }
    };
    load();
  }, []);

  return zonas;
};
