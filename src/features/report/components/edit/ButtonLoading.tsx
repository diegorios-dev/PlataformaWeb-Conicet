import { Loader2 } from "lucide-react";
import { CheckCircle2, Save, X } from "lucide-react";

const ButtonLoading = ({handleSubmit, loading, success, go}: {handleSubmit: () => void, loading: boolean, success: boolean, go: any}) => {
    return (          
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando cambios...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={20} />
                  ¡Guardado!
                </>
              ) : (
                <>
                  <Save size={20} className="transition-transform group-hover:scale-110" />
                  Guardar Cambios
                </>
              )}
            </button>
            <button
              type="button"
              onClick={go.reports.list}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-slate-200 group"
            >
              <X size={20} className="transition-transform group-hover:rotate-90" />
              Cancelar
            </button>
          </div>
    )
}

export default ButtonLoading;