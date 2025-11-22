import { Locate } from "lucide-react";

const DynamicsSelection = ({ formData, handleChange, sitios }: { formData: any; handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; sitios: any[] }) => {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Locate size={18} className="text-slate-500" />
            Sitio
            </label>
            <select
            name="site_id"
            value={formData.site_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 transition"
            >
            <option value="">Seleccione un sitio</option>
            {sitios.map(sitio => (
                <option key={sitio.id} value={sitio.id}>
                {sitio.zona?.locality} - Lat: {sitio.latitude}, Lon: {sitio.longitude}
                {sitio.event && ` (${sitio.event.type})`}
                </option>
            ))}
            </select>
            <span className="text-xs text-slate-500 mt-1.5 block">
            Al cambiar el sitio, la zona se actualizará automáticamente
            </span>
        </div>
    );
}

export default DynamicsSelection;