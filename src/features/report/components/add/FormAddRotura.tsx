import { useState, useEffect } from "react";
import { createReporteRotura } from "@features/report/services";
import { getAllSitios } from "@features/site/services";
import { getAllZonas } from "@features/zona/services";
import { AlertTriangle, MapPin, Calendar, Loader2, Wrench, MessageSquare, Camera, Mic, Save } from "lucide-react";
import { DashboardLayout } from "@shared/ui/layouts/DashboardLayout/DashboardLayout";
import {
  Input,
  Select,
  Textarea,
  FormField,
  ImageInput,
  AudioInput,
  ConfirmationModal,
  InfoBox,
} from "@shared/ui";

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

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleAudioChange = (file: File | null) => {
    setAudioFile(file);
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
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">

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
            <FormField label="Fecha del Reporte" icon={Calendar} required>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </FormField>

            {/* Zona */}
            <FormField label="Zona" icon={MapPin} required>
              <Select
                name="zona_id"
                value={formData.zona_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar zona...</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.locality}
                  </option>
                ))}
              </Select>
            </FormField>

            {/* Sitio */}
            <FormField label="Sitio de Medición" icon={MapPin} required>
              <Select
                name="site_id"
                value={formData.site_id}
                onChange={handleInputChange}
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
              </Select>
            </FormField>

            {/* Descripción del Daño */}
            <FormField label="Descripción del Daño" icon={Wrench} required>
              <Textarea
                name="description_damage"
                value={formData.description_damage}
                onChange={handleInputChange}
                placeholder="Describe el daño o rotura del instrumento..."
                rows={4}
                required
              />
            </FormField>

            {/* Nota Adicional (Opcional) */}
            <FormField label="Nota Adicional (Opcional)" icon={MessageSquare}>
              <Textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Información adicional sobre el reporte..."
                rows={3}
              />
            </FormField>

            {/* Imagen */}
            <FormField label="Imagen (Opcional)" icon={Camera}>
              <ImageInput
                onImageChange={handleImageChange}
                imagePreview={imagePreview}
              />
            </FormField>

            {/* Audio */}
            <FormField label="Audio (Opcional)" icon={Mic}>
              <AudioInput
                onAudioChange={handleAudioChange}
                audioFile={audioFile}
              />
            </FormField>

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
        <InfoBox
          icon={AlertTriangle}
          title="Reporte de Rotura"
          description="Este formulario es para registrar daños o roturas en los instrumentos de medición. Asegurate de describir detalladamente el problema para facilitar su reparación."
          variant="warning"
        />
      </div>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={modalOpen}
        type={modalType}
        message={modalMessage}
      />
    </DashboardLayout>
  );
};

export default FormAddRotura;
