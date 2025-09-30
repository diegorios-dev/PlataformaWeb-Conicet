import { useEffect, useState } from "react";
import { updateReporte } from "../../../services/reporteService";
import { useUserContext } from "../../../context/UserContext";
import useNavegation from "../../../hooks/useNavegation";

const FormEditReport = () => {
  
  const {report} = useUserContext();
  const {goReports, goBack} = useNavegation()

  console.log(report)

  const [formData, setFormData] = useState({
    note: report.note || "",
    amount: report.report_regular?.amount || "",
    latitude: report.site?.latitude || "",
    longitude: report.site?.longitude || "",
    locality: report.site.zona?.locality || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(formData)
  }, [formData])
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };

  const handleSubmit = async (e) => {
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
      console.error("Error al actualizar:", error);
      alert("❌ Hubo un problema al actualizar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 bg-gray-100">
      <div className="p-8 ">
      <button
      onClick={goBack}
       className="px-6 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-950 transition font-semibold text-base"
      type="button"
      >
      Volver
      </button>
   </div>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-2">
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg ">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Editar Reporte ID {report.id}
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Fecha : {report.date}
            </span>
          </h2>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Nota:</span>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Cantidad caída:</span>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Latitud:</span>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Longitud:</span>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Zona:</span>
            <input
              type="text"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={goReports}
              className="flex-1 p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
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
