import { MapPin } from "lucide-react";

const LabelZone = ({ zonaSeleccionada } : { zonaSeleccionada: any }) => {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <MapPin size={18} className="text-slate-500" />
            Zona (automática)
            </label>
            <input
            type="text"
            value={zonaSeleccionada?.locality || ""}
            disabled
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
            placeholder="Seleccione un sitio primero"
            />
            <span className="text-xs text-slate-500 mt-1.5 block">
            La zona se asigna automáticamente según el sitio seleccionado
            </span>
        </div>
    )
}

export default LabelZone;