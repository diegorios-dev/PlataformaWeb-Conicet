import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastProps = {
  isOpen: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
};

const Toast = ({ isOpen, type, message, onClose }: ToastProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-all duration-200 hover:scale-110"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`p-4 rounded-2xl mb-4 ${
              type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {type === "success" ? (
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-600" />
            )}
          </div>

          <h3
            className={`text-2xl font-bold mb-2 ${
              type === "success" ? "text-green-900" : "text-red-900"
            }`}
          >
            {type === "success" ? "Éxito" : "Error"}
          </h3>
          <p
            className={`text-base mb-6 ${
              type === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>

          <button
            onClick={onClose}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105 shadow-lg ${
              type === "success"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-600/30"
                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/30"
            }`}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
