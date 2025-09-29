import { useEffect, useState } from "react";
import { updateReporte } from "../../../services/reporteService";
import { useUserContext } from "../../../context/UserContext";
import useNavegation from "../../../hooks/useNavegation";

const FormEditReport = () => {
  
  const {report} = useUserContext();
  const {goReports} = useNavegation()

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
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Editar Reporte ID {report.id}
        Fecha : {report.date}
      </h2>

      <label className="block mb-2">
        Nota:
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Cantidad caída:
        <input
          type="text"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Latitud:
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Longitud:
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Zona:
        <input
          type="text"
          name="locality"
          value={formData.locality}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={goReports}
          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormEditReport;
