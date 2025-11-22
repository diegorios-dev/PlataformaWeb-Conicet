import { useState, useEffect } from "react";
import { createReporteRotura } from "../../../../services/reportService";
import { getAllSitios } from "../../../../services/sitiosService";
import { getAllZonas } from "../../../../services/zonaService";
import {AlertTriangle,X,MapPin,Calendar,CheckCircle2,Loader2,Wrench,MessageSquare,Camera,Mic,Save} from "lucide-react";
import BackButton from "../../../../shared/ui/buttons/BackButton";

const FormAddRotura = () => {
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    note: "",
    description_damage: "",
    site_id: "",
    zona_id: "",
  });

  const [sitios, setSitios] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);
  const [sitiosFiltrados, setSitiosFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados para imagen y audio
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Estados para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [sitiosData, zonasData] = await Promise.all([
        getAllSitios(),
        getAllZonas(),
      ]);
      setSitios(sitiosData);
      setZonas(zonasData);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  };

  // Filtrar sitios cuando cambia la zona
  useEffect(() => {
    if (formData.zona_id) {
      const filtered = sitios.filter(
        (sitio) => sitio.zona_id === parseInt(formData.zona_id)
      );
      setSitiosFiltrados(filtered);
      // Limpiar site_id si no está en la zona seleccionada
      if (
        formData.site_id &&
        !filtered.find((s) => s.id === parseInt(formData.site_id))
      ) {
        setFormData((prev) => ({ ...prev, site_id: "" }));
      }
    } else {
      setSitiosFiltrados([]);
      setFormData((prev) => ({ ...prev, site_id: "" }));
    }
  }, [formData.zona_id, sitios]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const removeAudio = () => {
    setAudioFile(null);
  };

  const showModal = (type: "success" | "error", message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);
    setTimeout(() => {
      setModalOpen(false);
      if (type === "success") {
        // Resetear formulario
        setFormData({
          date: new Date().toISOString().split("T")[0],
          note: "",
          description_damage: "",
          site_id: "",
          zona_id: "",
        });
        setImageFile(null);
        setImagePreview("");
        setAudioFile(null);
      }
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.site_id) {
      showModal("error", "Por favor seleccioná un sitio");
      return;
    }

    if (!formData.description_damage.trim()) {
      showModal("error", "Por favor ingresá una descripción del daño");
      return;
    }

    setLoading(true);

    try {
      // Crear FormData para enviar archivos
      const data = new FormData();
      data.append("date", formData.date);
      data.append("note", formData.note);
      data.append("description_damage", formData.description_damage);
      data.append("site_id", formData.site_id);

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (audioFile) {
        data.append("audio", audioFile);
      }

      await createReporteRotura(data);
      showModal("success", "Reporte de rotura creado exitosamente");
    } catch (error: any) {
      console.error("Error al crear reporte de rotura:", error);
      showModal(
        "error",
        error.response?.data?.message || "Error al crear el reporte de rotura"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/20 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg shadow-red-500/30">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Nuevo Reporte de Rotura
            </h1>
            <p className="text-base text-slate-600 mt-1 font-medium">
              Registrá un daño o rotura en el instrumento
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl shadow-xl p-6 md:p-8 space-y-6">
            
            {/* Fecha */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Calendar className="w-5 h-5 text-red-600" />
                Fecha del Reporte
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200"
                required
              />
            </div>

            {/* Zona */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <MapPin className="w-5 h-5 text-red-600" />
                Zona
              </label>
              <select
                name="zona_id"
                value={formData.zona_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200"
                required
              >
                <option value="">Seleccionar zona...</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.locality}
                  </option>
                ))}
              </select>
            </div>

            {/* Sitio */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <MapPin className="w-5 h-5 text-red-600" />
                Sitio de Medición
              </label>
              <select
                name="site_id"
                value={formData.site_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.zona_id}
                required
              >
                <option value="">
                  {formData.zona_id
                    ? "Seleccionar sitio..."
                    : "Primero seleccioná una zona"}
                </option>
                {sitiosFiltrados.map((sitio) => (
                  <option key={sitio.id} value={sitio.id}>
                    {sitio.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción del Daño */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Wrench className="w-5 h-5 text-red-600" />
                Descripción del Daño *
              </label>
              <textarea
                name="description_damage"
                value={formData.description_damage}
                onChange={handleInputChange}
                placeholder="Describe el daño o rotura del instrumento..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Nota Adicional (Opcional) */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <MessageSquare className="w-5 h-5 text-red-600" />
                Nota Adicional (Opcional)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Información adicional sobre el reporte..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200 resize-none"
              />
            </div>

            {/* Imagen */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Camera className="w-5 h-5 text-red-600" />
                Imagen (Opcional)
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-xl border-2 border-slate-200 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Audio */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Mic className="w-5 h-5 text-red-600" />
                Audio (Opcional)
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {audioFile && (
                  <div className="flex items-center justify-between bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <span className="text-sm font-semibold text-red-700">
                      {audioFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={removeAudio}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-2xl font-bold shadow-lg shadow-red-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Reporte de Rotura
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Información */}
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-3 rounded-xl shadow-sm flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-red-900 mb-1">
                Reporte de Rotura
              </h4>
              <p className="text-sm text-red-800">
                Este formulario es para registrar daños o roturas en los instrumentos de medición.
                Asegurate de describir detalladamente el problema para facilitar su reparación.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-2xl mb-4 ${
                  modalType === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {modalType === "success" ? (
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                )}
              </div>

              <h3
                className={`text-2xl font-bold mb-2 ${
                  modalType === "success" ? "text-green-900" : "text-red-900"
                }`}
              >
                {modalType === "success" ? "¡Éxito!" : "Error"}
              </h3>
              <p
                className={`text-base ${
                  modalType === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {modalMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAddRotura;
