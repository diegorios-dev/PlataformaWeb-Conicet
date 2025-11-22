import { CheckCircle2, Loader2 } from "lucide-react";

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const FormActions = ({ loading, onCancel, onSubmit }: FormActionsProps) => {
  return (
    <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all duration-200 hover:scale-105"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={loading}
        onClick={onSubmit}
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
  );
};