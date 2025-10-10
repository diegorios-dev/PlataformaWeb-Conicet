import { useEffect, useState } from "react";
import { updateReporte } from "../../../services/reportService";
import { useUserContext } from "../../../context/UserContext";
import useNavegation from "../../../hooks/useNavegation";
import {
  
  Save,
  X,
  FileText,
  MapPin,
  Droplets,
  LocateFixed,
  MapIcon
} from "lucide-react";
import BackButton from "../../BackButton";
const FormEditReport = () => {
  const { report } = useUserContext();
  const { goReports} = useNavegation();

  const [formData, setFormData] = useState({
    note: report.note || "",
    amount: report.report_regular?.amount || "",
    latitude: report.site?.latitude || "",
    longitude: report.site?.longitude || "",
    locality: report.site.zona?.locality || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(formData)
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        note: formData.note,
        report_regular: {
          amount: formData.amount,
        },
        site: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        zona: {
          locality: formData.locality,
        },
      };

      await updateReporte(report.id, payload);
      alert("Reporte actualizado con éxito ✅");
    } catch (error) {
      alert("❌ Hubo un problema al actualizar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-neutral-50 flex flex-col">
      <div className="flex items-center justify-between px-20 py-6  border-neutral-200 bg-white">
        <BackButton />
        
      </div>
      <div className="flex flex-1 items-center justify-center">
        
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
          <div className="mb-6">
            <span className="text-lg font-semibold text-neutral-700">
              Editar Reporte
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <FileText size={22} className="text-neutral-500" />
                Reporte #{report.id}
              </h2>
              <span className="block text-sm text-neutral-500 mt-1">
                Fecha: {report.date}
              </span>
            </div>

            <label className="block">
              <span className="text-neutral-700 font-medium flex items-center gap-2 mb-1">
                <FileText size={18} className="text-neutral-400" />
                Nota
              </span>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 text-neutral-900 transition"
                placeholder="Escribe una nota..."
                autoComplete="off"
              />
            </label>

            <label className="block">
              <span className="text-neutral-700 font-medium flex items-center gap-2 mb-1">
                <Droplets size={18} className="text-neutral-400" />
                Cantidad caída
              </span>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 text-neutral-900 transition"
                placeholder="Ej: 12.5"
                autoComplete="off"
              />
            </label>
    <div className="flex gap-4">
      <label className="flex-1 block">
        <span className="text-neutral-700 font-medium mb-1 block">
          Latitud
        </span>
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-neutral-300 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 text-neutral-900 transition"
          placeholder="Ej: -34.6037"
          autoComplete="off"
        />
      </label>
      <label className="flex-1 block">
        <span className="text-neutral-700 font-medium mb-1 block">
          Longitud
        </span>
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-neutral-300 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 text-neutral-900 transition"
          placeholder="Ej: -58.3816"
          autoComplete="off"
        />
      </label>
    </div>
            <label className="block">
              <span className="text-neutral-700 font-medium flex items-center gap-2 mb-1">
                <MapIcon size={18} className="text-neutral-400" />
                Zona
              </span>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-full bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 text-neutral-900 transition"
                placeholder="Ej: Palermo"
                autoComplete="off"
              />
            </label>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Save size={18} />
                {loading ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={goReports}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-200 text-neutral-700 rounded-full font-semibold hover:bg-neutral-300 transition"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEditReport;
 


