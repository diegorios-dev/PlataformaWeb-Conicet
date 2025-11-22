import { useState } from "react";
import { deleteSite } from "../services/siteService";

interface UseSiteDeleteProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const useSiteDelete = ({ onSuccess, onError }: UseSiteDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const openDeleteModal = (site: any) => {
    setSelectedSite(site);
    setIsOpen(true);
  };

  const closeDeleteModal = () => {
    setIsOpen(false);
    setSelectedSite(null);
  };

  const handleDelete = async () => {
    if (!selectedSite) return;

    setLoading(true);
    try {
      await deleteSite(selectedSite.id);

      onSuccess?.("Sitio eliminado correctamente");
      closeDeleteModal();
    } catch (err) {
      onError?.("Error al eliminar el sitio");
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    selectedSite,
    loading,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
};
