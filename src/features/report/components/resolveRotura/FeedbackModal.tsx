import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { ModalType } from "../../hooks/useModal";

interface FeedbackModalProps {
  isOpen: boolean;
  type: ModalType;
  message: string;
  onClose?: () => void;
}

export const FeedbackModal = ({
  isOpen,
  type,
  message,
  onClose,
}: FeedbackModalProps) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      titleColor: "text-green-900",
      messageColor: "text-green-700",
      title: "¡Éxito!",
    },
    error: {
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      titleColor: "text-red-900",
      messageColor: "text-red-700",
      title: "Error",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
      titleColor: "text-amber-900",
      messageColor: "text-amber-700",
      title: "Advertencia",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      titleColor: "text-blue-900",
      messageColor: "text-blue-700",
      title: "Información",
    },
  };

  const { icon: Icon, bgColor, textColor, titleColor, messageColor, title } =
    config[type];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 animate-in fade-in zoom-in">
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-2xl mb-4 ${bgColor}`}>
            <Icon className={`w-12 h-12 ${textColor}`} />
          </div>

          <h3 className={`text-2xl font-bold mb-2 ${titleColor}`}>{title}</h3>
          <p className={`text-base ${messageColor}`}>{message}</p>

          {onClose && (
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};