import { useReportSelection } from "@context/ReportContext";
import { useNavigate } from "react-router-dom";
import { useResolveRotura } from "../../hooks/useResolveRotura";
import { CheckCircle2 } from "lucide-react";
import BackButton from "@shared/ui/buttons/BackButton";
import { FeedbackModal } from "./FeedbackModal";
import { ReportDamageInfo } from "./ReportDamageInfo";
import { ConfirmationMessage } from "./ConfirmationMessage";
import { FormActions } from "./FormActions";
import { WarningInfo } from "./WarningInfo";

const FormResolveRotura = () => {
  const { report } = useReportSelection();
  const navigate = useNavigate();

  const {
    loading,
    isValidReport,
    handleResolve,
    handleCancel,
    modal,
  } = useResolveRotura({
    report,
    redirectPath: "/dashboard/administration/report",
  });

  // Si no hay reporte válido, redirigir
  if (!isValidReport) {
    navigate("/dashboard/administration/report");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleResolve();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Resolver Reporte de Rotura
            </h1>
            <p className="text-base text-slate-600 mt-1 font-medium">
              Reporte #{report.id} - Marcar como resuelto
            </p>
          </div>
        </div>

        {/* Información del Reporte Original */}
        <ReportDamageInfo report={report} />

        {/* Formulario de Confirmación */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl shadow-xl p-6 md:p-8 space-y-6">
            <ConfirmationMessage />
            <FormActions
              loading={loading}
              onCancel={handleCancel}
              onSubmit={handleResolve}
            />
          </div>
        </form>

        {/* Información */}
        <WarningInfo />
      </div>

      {/* Modal de confirmación */}
      <FeedbackModal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={modal.close}
      />
    </div>
  );
};

export default FormResolveRotura;