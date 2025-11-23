import { useState, useEffect } from 'react';
import type { UserType, Zona, Site, Instrument } from '../types';
import { getAllSitios } from '@features/site/services';
import { getAllZonas } from '@features/zona/services';
import {
  getAllInstruments,
  getUserInstruments
} from '@features/user/services';

interface UseUserFormStateProps {
  selectedUser: UserType;
}

interface UseUserFormStateReturn {
  sitios: Site[];
  zonas: Zona[];
  zonaSeleccionada: Zona | null;
  setZonaSeleccionada: (zona: Zona | null) => void;
  allInstruments: Instrument[];
  userInstruments: Instrument[];
  setUserInstruments: (instruments: Instrument[]) => void;
  loadingInstruments: boolean;
}

export const useUserFormState = ({
  selectedUser
}: UseUserFormStateProps): UseUserFormStateReturn => {
  // Estados
  const [sitios, setSitios] = useState<Site[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);

  const [allInstruments, setAllInstruments] = useState<Instrument[]>([]);
  const [userInstruments, setUserInstruments] = useState<Instrument[]>([]);
  const [loadingInstruments, setLoadingInstruments] = useState(false);

  // Cargar sitios y zonas
  useEffect(() => {
    const fetchSitios = async () => {
      try {
        const data = await getAllSitios();
        setSitios(data);

        if (selectedUser?.site_id) {
          const sitioActual = data.find((s: Site) => s.id === selectedUser.site_id);
          if (sitioActual?.zona) setZonaSeleccionada(sitioActual.zona);
        }
      } catch (e) {
        console.error('Error al cargar sitios:', e);
      }
    };

    const fetchZonas = async () => {
      try {
        const zonasData = await getAllZonas();
        setZonas(zonasData);
      } catch (e) {
        console.error('Error al cargar zonas:', e);
      }
    };

    fetchSitios();
    fetchZonas();
  }, [selectedUser?.site_id]);

  // Cargar instrumentos
  useEffect(() => {
    const fetchInstruments = async () => {
      if (!selectedUser?.id) return;

      setLoadingInstruments(true);
      try {
        const all = await getAllInstruments();
        setAllInstruments(all.instruments || all || []);

        const userInst = await getUserInstruments(selectedUser.id);
        setUserInstruments(userInst.instruments || []);
      } catch (e) {
        console.error('Error al cargar instrumentos:', e);
      }
      setLoadingInstruments(false);
    };

    fetchInstruments();
  }, [selectedUser?.id]);

  return {
    sitios,
    zonas,
    zonaSeleccionada,
    setZonaSeleccionada,
    allInstruments,
    userInstruments,
    setUserInstruments,
    loadingInstruments
  };
};
