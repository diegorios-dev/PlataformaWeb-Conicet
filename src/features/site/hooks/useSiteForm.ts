import { useState } from "react";
import {createSite, updateSite, validateSiteData } from "../services/siteService";
import type { Site } from "../services/siteService";

interface UseSiteFormParams {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onClose?: () => void;
}

const useSiteForm = ({ onSuccess, onError, onClose }: UseSiteFormParams = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState<Partial<Site>>({});
  const [loading, setLoading] = useState(false);

  const openForm = (site?: Site) => {
    setEditMode(!!site);
    setSelectedSite(site || null);
    setFormData(site ? { ...site } : {});
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setSelectedSite(null);
    setFormData({});
    setEditMode(false);
    if (onClose) onClose();
  };

  const handleChange = (field: keyof Site, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validar datos
    const validationError = validateSiteData(formData);
    if (validationError) {
      if (onError) onError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (editMode && selectedSite) {
        const response = await updateSite(selectedSite.id!, formData);
        if (onSuccess) onSuccess(response.message || "Sitio actualizado correctamente");
      } else {
        const response = await createSite(formData as Site);
        if (onSuccess) onSuccess(response.message || "Sitio creado correctamente");
      }
      closeForm();
    } catch (error: any) {
      if (onError) onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    editMode,
    selectedSite,
    formData,
    loading,
    openForm,
    closeForm,
    handleChange,
    handleSubmit,
  };
};

export { useSiteForm };
export default useSiteForm;