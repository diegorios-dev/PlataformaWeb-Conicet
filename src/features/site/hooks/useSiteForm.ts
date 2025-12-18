import { useState, useCallback } from "react";
import {createSite, updateSite, validateSiteData } from "../services";
import type { Site } from "../services";

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

  // ✅ OPTIMIZACIÓN: Memoizar openForm con useCallback
  const openForm = useCallback((site?: Site) => {
    setEditMode(!!site);
    setSelectedSite(site || null);
    setFormData(site ? { ...site } : {});
    setIsOpen(true);
  }, []);

  // ✅ OPTIMIZACIÓN: Memoizar closeForm con useCallback
  const closeForm = useCallback(() => {
    setIsOpen(false);
    setSelectedSite(null);
    setFormData({});
    setEditMode(false);
    if (onClose) onClose();
  }, [onClose]);

  // ✅ OPTIMIZACIÓN: Memoizar handleChange con useCallback
  const handleChange = useCallback((field: keyof Site, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ✅ OPTIMIZACIÓN: Memoizar handleSubmit con useCallback
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
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
    } catch (error: unknown) {
      const err = error as {message?: string};
      if (onError) onError(err.message || 'Error al guardar sitio');
    } finally {
      setLoading(false);
    }
  }, [editMode, selectedSite, formData, onSuccess, onError, closeForm]);

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