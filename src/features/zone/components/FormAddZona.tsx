import { useState, useEffect } from "react";
import { postNewZona ,getAllZonas, updateZona, deleteZona} from "@features/zone/services";
import { validateZonaData } from "@shared/utils/validators";
import Toast from "@shared/ui/Loading/Toast";
import { Plus, MapPin, Loader2, MapPinned, AlertCircle, Pencil, Trash2, X } from "lucide-react";
import { DashboardLayout } from '@shared/ui/layouts/DashboardLayout';

type Zona = {
  id: number;
  locality: string;
};

const FormAddZona = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [zonaToEdit, setZonaToEdit] = useState<Zona | null>(null);
  const [zonaToDelete, setZonaToDelete] = useState<Zona | null>(null);
  const [editLocality, setEditLocality] = useState("");
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingZonas, setLoadingZonas] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    locality: "",
    site: { latitude: "", longitude: "" },
  });

  useEffect(() => {
    fetchZonas();
  }, []);

  const fetchZonas = async () => {
    try {
      const zonasData = await getAllZonas();
      setZonas(zonasData);
    } catch (err) {
      showToast("error", "Error al cargar las zonas");
    } finally {
      setLoadingZonas(false);
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToastType(type);
    setToastMessage(message);
    setToastOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar error previo
    setValidationError(null);

    // Validar datos
    const validationError = validateZonaData({ locality: formData.locality });
    if (validationError) {
      setValidationError(validationError);
      showToast("error", validationError);
      return;
    }

    setLoading(true);
    try {
      await postNewZona(formData);
      showToast("success", "¡Zona agregada exitosamente!");
      setFormData({ locality: "", site: { latitude: "", longitude: "" } });
      setValidationError(null);
      await fetchZonas();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrar la zona";
      setValidationError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout contentClassName="">
      <div className="w-full max-w-7xl mx-auto">

        {/* Modal editar zona */}
        {editModalOpen && zonaToEdit && (
          <div className="fixed inset-0 z-[2000] bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100" onClick={() => setEditModalOpen(false)}>
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-700">Editar Zona</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  // Validar antes de actualizar
                  const validationError = validateZonaData({ locality: editLocality });
                  if (validationError) {
                    showToast("error", validationError);
                    return;
                  }
                  
                  try {
                    await updateZona(zonaToEdit.id, { locality: editLocality });
                    setEditModalOpen(false);
                    showToast("success", "Zona modificada correctamente");
                    await fetchZonas();
                  } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Error al modificar la zona";
                    showToast("error", errorMessage);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Nombre de la zona</label>
                  <input
                    type="text"
                    value={editLocality}
                    onChange={e => setEditLocality(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold" onClick={() => setEditModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal eliminar zona */}
        {deleteModalOpen && zonaToDelete && (
          <div className="fixed inset-0 z-[2000] bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100" onClick={() => setDeleteModalOpen(false)}>
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-red-700">Eliminar Zona</h2>
              <p className="mb-6 text-slate-700">¿Estás seguro que deseas eliminar la zona <span className="font-bold">{zonaToDelete.locality}</span>? Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 justify-end">
                <button type="button" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
                  onClick={async () => {
                    try {
                      await deleteZona(String(zonaToDelete.id));
                      setDeleteModalOpen(false);
                      showToast("success", "Zona eliminada correctamente");
                      await fetchZonas();
                    } catch (err) {
                      showToast("error", "Error al eliminar la zona");
                    }
                  }}
                >Eliminar</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Header estilo ShowReport */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <MapPinned className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Gestión de Zonas
              </h1>
              <p className="text-base text-slate-600 mt-1 font-medium">
                {zonas.length} {zonas.length === 1 ? "zona registrada" : "zonas registradas"}
              </p>
            </div>
          </div>
        </div>

        {/* Card de formulario estilo ShowReport */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Agregar Nueva Zona</h2>
            <p className="text-sm text-slate-600">Registra una nueva localidad en el sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mostrar error de validación */}
            {validationError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-900 font-bold text-sm mb-1">Error de validación</h4>
                  <p className="text-red-700 text-sm">{validationError}</p>
                </div>
              </div>
            )}
            
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                <MapPin size={18} className="text-sky-600" />
                Localidad
              </label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Ej: Ing. Jacobacci"
                className="w-full px-4 py-4 bg-slate-50/80 border-2 border-slate-200 rounded-2xl 
                           focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 
                           transition-all duration-200 text-slate-700 placeholder:text-slate-400 hover:border-slate-300 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.locality.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 
                         hover:from-sky-700 hover:to-indigo-700 text-white rounded-2xl font-bold 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
                         shadow-lg shadow-sky-600/30 hover:shadow-xl hover:scale-[1.01] group"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Agregando zona...
                </>
              ) : (
                <>
                  <Plus size={20} className="transition-transform group-hover:rotate-90" />
                  Agregar Zona
                </>
              )}
            </button>
          </form>
        </div>

        {/* Gestión de Zonas */}

        {/* Lista de zonas estilo ShowReport */}
        <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b-2 border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Zonas Registradas</h3>
                  <p className="text-xs text-slate-600">
                    {zonas.length} {zonas.length === 1 ? "zona disponible" : "zonas disponibles"}
                  </p>
                </div>
              </div>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {zonas.length}
              </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loadingZonas ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                <p className="text-sm text-slate-600">Cargando zonas...</p>
              </div>
            ) : zonas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-slate-100 rounded-full p-6 mb-4">
                  <MapPin className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-700 mb-2">No hay zonas registradas</h4>
                <p className="text-sm text-slate-500">Agrega tu primera zona usando el formulario</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 bg-white">
                {zonas.map((zona, index) => (
                  <div
                    key={zona.id}
                    className="group px-6 py-4 hover:bg-blue-50/50 transition-colors duration-150 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg transition-colors">
                        <MapPin size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block">{zona.locality}</span>
                        <span className="text-xs text-slate-500">ID: {zona.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Editar zona"
                        onClick={() => {
                          setZonaToEdit(zona);
                          setEditLocality(zona.locality);
                          setEditModalOpen(true);
                        }}
                      >
                        <Pencil size={18} className="text-blue-500" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Eliminar zona"
                        onClick={() => {
                          setZonaToDelete(zona);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 size={18} className="text-black-500" />
                      </button>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-3 rounded-xl shadow-sm flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-blue-900 mb-1">Información importante</h4>
              <p className="text-sm text-blue-800">
                Las zonas registradas se utilizan para clasificar y organizar los reportes de precipitación.
                Asegúrate de ingresar nombres claros y específicos para facilitar la búsqueda.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toast
        isOpen={toastOpen}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </DashboardLayout>
  );
};

export default FormAddZona;