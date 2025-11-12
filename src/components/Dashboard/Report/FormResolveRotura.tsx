import { useState } from "react";
import { resolveReporteRotura } from "../../../services/reportService";
import { useUserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import BackButton from "../../BackButton";

const FormResolveRotura = () => {
  const { report } = useUserContext();
  const navigate = useNavigate();

  // Si no hay reporte en el contexto o no tiene breakage_instrument, redirigir
  if (!report || !report.id || !report.breakage_instrument?.id) {
    navigate("/dashboard/administration/report");
    return null;
  }

  const [loading, setLoading] = useState(false);

  // Estados para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (type: "success" | "error", message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);
    setTimeout(() => {
      setModalOpen(false);
      if (type === "success") {
        navigate("/dashboard/administration/report");
      }
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Usar el ID del breakage_instrument (hijo) en lugar del report.id (padre)
      await resolveReporteRotura(report.breakage_instrument.id);
      showModal("success", "Reporte de rotura eliminado exitosamente");

    } catch (error: any) {
      console.error("Error al resolver reporte de rotura:", error);
      showModal(
        "error",
        error.response?.data?.message || "Error al eliminar el reporte"
      );
    } finally {
      setLoading(false);
    }
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
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-xl shadow-sm flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">
                Información del Daño Original
              </h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-semibold text-red-800">Fecha:</span>
                  <span className="text-red-700">{report.date}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-red-800">Sitio:</span>
                  <span className="text-red-700">{report.site?.nombre}</span>
                </div>
                {report.breakage_instrument?.description_damage && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-red-800">
                      Descripción del daño:
                    </span>
                    <p className="text-red-700 bg-red-100/50 p-3 rounded-xl border border-red-200">
                      {report.breakage_instrument.description_damage}
                    </p>
                  </div>
                )}
                {report.note && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-red-800">Nota:</span>
                    <p className="text-red-700 italic">{report.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Confirmación */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl shadow-xl p-6 md:p-8 space-y-6">
            
            {/* Mensaje de confirmación */}
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-500/30">
                  <AlertTriangle className="w-16 h-16 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                ¿Confirmar eliminación de rotura?
              </h2>
              <p className="text-lg text-slate-600 mb-2">
                Esta acción eliminará permanentemente el reporte de rotura.
              </p>
              <p className="text-base text-slate-500">
                Esta operación no se puede deshacer.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/dashboard/administration/report")}
                className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all duration-200 hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl font-bold shadow-lg shadow-red-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Confirmar Eliminación
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Información */}
        <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-3 rounded-xl shadow-sm flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-amber-900 mb-1">
                Atención
              </h4>
              <p className="text-sm text-amber-800">
                Al confirmar, el reporte de rotura será eliminado permanentemente del sistema.
                Asegurate de haber resuelto el problema antes de proceder.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-2xl mb-4 ${
                  modalType === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {modalType === "success" ? (
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                )}
              </div>

              <h3
                className={`text-2xl font-bold mb-2 ${
                  modalType === "success" ? "text-green-900" : "text-red-900"
                }`}
              >
                {modalType === "success" ? "¡Éxito!" : "Error"}
              </h3>
              <p
                className={`text-base ${
                  modalType === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {modalMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResolveRotura;
