import { MapPin } from "lucide-react";

const LabelCoords = ({ sitioSeleccionado } : { sitioSeleccionado: any }) => {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <MapPin size={18} className="text-slate-500" />
            Coordenadas del Sitio
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                Latitud
                </label>
                <span className="text-slate-700 font-mono text-sm font-semibold">
                {sitioSeleccionado?.latitude || 'N/A'}
                </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                Longitud
                </label>
                <span className="text-slate-700 font-mono text-sm font-semibold">
                {sitioSeleccionado?.longitude || 'N/A'}
                </span>
            </div>
            </div>
            <span className="text-xs text-slate-500 mt-1.5 block">
            Las coordenadas son del sitio seleccionado y no se pueden editar directamente
            </span>
        </div>
    )
}

export default LabelCoords;