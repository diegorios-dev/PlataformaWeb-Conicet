import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveRoturaReport, validateRoturaReport } from "../services/resolveRoturaReport";
import useModal from "./useModal";

interface UseResolveRoturaParams {
  report: any;
  redirectPath?: string;
}

export const useResolveRotura = ({
  report,
  redirectPath = "/dashboard/administration/report",
}: UseResolveRoturaParams) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { isOpen, modalType, modalMessage, showModal, closeModal } = useModal(
    () => {
      if (modalType === "success") {
        navigate(redirectPath);
      }
    }
  );

  // Validar si el reporte es válido
  const isValidReport = validateRoturaReport(report);

  /**
   * Maneja el proceso de resolución de la rotura
   */
  const handleResolve = async () => {
    if (!isValidReport) {
      showModal("error", "Reporte no válido o incompleto", 0);
      return;
    }

    setLoading(true);

    try {
      const response = await resolveRoturaReport(report.breakage_instrument.id);
      showModal("success", response.message);
    } catch (error: unknown) {
      const err = error as {message?: string};
      showModal("error", err.message || "Error al resolver la rotura");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancela la operación y redirige
   */
  const handleCancel = () => {
    navigate(redirectPath);
  };

  return {
    loading,
    isValidReport,
    handleResolve,
    handleCancel,
    modal: {
      isOpen,
      type: modalType,
      message: modalMessage,
      close: closeModal,
    },
  };
};