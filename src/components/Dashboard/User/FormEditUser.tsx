import { useState, useEffect } from "react";

// Types
interface Zona {
  id: number;
  locality: string;
}

interface Site {
  id: number;
  latitude: string;
  longitude: string;
  zona_id: number;
  zona?: Zona;
}

interface Instrument {
  id: number;
  name: string;
  brand?: string;
  model?: string;
  tipo_evento?: string;
  unidad_medida?: { name: string; symbol: string };
}

interface UserType {
  id: number;
  name: string;
  password?: string;
  rol: string;
  site_id?: number;
  zona_id?: number;
  site?: Site;
  zona?: Zona;
}

import { getAllSitios } from "../../../services/sitiosService";
import {
  getAllInstruments,
  getUserInstruments,
  assignInstrumentToUser,
  removeInstrumentFromUser
} from "../../../services/instrumentService";

import {
  User,
  KeyRound,
  Shield,
  MapPinned,
  Save,
  X,
  Locate,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Plus,
  Trash2
} from "lucide-react";

// Estilos unificados
const inputClass =
  "w-full px-4 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200";

const selectClass =
  "w-full px-4 py-3 bg-white border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 cursor-pointer";

const buttonClass =
  "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg";

const FormEditUser = ({
  selectedUser,
  setSelectedUser,
  setShowEditModal,
  saveUser,
  onSave
}: {
  selectedUser: UserType;
  setSelectedUser: (u: UserType) => void;
  setShowEditModal: (v: boolean) => void;
  saveUser: (u: UserType) => Promise<any>;
  onSave?: () => void;
}) => {
  // Estados
  const [sitios, setSitios] = useState<Site[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<Zona | null>(null);

  const [allInstruments, setAllInstruments] = useState<Instrument[]>([]);
  const [userInstruments, setUserInstruments] = useState<Instrument[]>([]);
  const [pendingAddInstruments, setPendingAddInstruments] = useState<number[]>([]);
  const [pendingRemoveInstruments, setPendingRemoveInstruments] = useState<number[]>([]);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>("");

  const [loadingInstruments, setLoadingInstruments] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState<string>("");

  // Cargar sitios y zonas
  useEffect(() => {
    const fetchSitios = async () => {
      try {
        const data = await getAllSitios();
        setSitios(data);

        if (selectedUser?.site_id) {
          const sitioActual = data.find((s) => s.id === selectedUser.site_id);
          if (sitioActual?.zona) setZonaSeleccionada(sitioActual.zona);
        }
      } catch (e) {
        console.error("Error al cargar sitios:", e);
      }
    };

    const fetchZonas = async () => {
      try {
        const data = await import("../../../services/zonaService");
        const zonasData = await data.getAllZonas();
        setZonas(zonasData);
      } catch (e) {
        console.error("Error al cargar zonas:", e);
      }
    };

    fetchSitios();
    fetchZonas();
  }, [selectedUser?.site_id]);

  // Cargar instrumentos
  useEffect(() => {
    const fetchInstruments = async () => {
      if (!selectedUser?.id) return;

      setLoadingInstruments(true);
      try {
        const all = await getAllInstruments();
        setAllInstruments(all.instruments || all || []);

        const userInst = await getUserInstruments(selectedUser.id);
        setUserInstruments(userInst.instruments || []);
      } catch (e) {
        console.error("Error al cargar instrumentos:", e);
        showModal("error", "Error al cargar instrumentos");
      }
      setLoadingInstruments(false);
    };

    fetchInstruments();
  }, [selectedUser?.id]);

  const showModal = (type: "success" | "error", message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);

    setTimeout(() => {
      setModalOpen(false);
      if (type === "success") {
        setShowEditModal(false);
        onSave?.();
      }
    }, 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const u = {
        ...selectedUser,
        zona_id: zonaSeleccionada?.id ?? selectedUser.zona_id
      };

      await saveUser(u);

      for (const id of pendingAddInstruments) {
        await assignInstrumentToUser(selectedUser.id, id);
      }

      for (const id of pendingRemoveInstruments) {
        await removeInstrumentFromUser(selectedUser.id, id);
      }

      setPendingAddInstruments([]);
      setPendingRemoveInstruments([]);

      showModal("success", "Usuario actualizado correctamente");
    } catch (e) {
      console.error("Error al guardar usuario:", e);
      showModal("error", "Error al actualizar usuario");
    }
    setIsSaving(false);
  };

  const handleAddInstrument = () => {
    if (!selectedInstrumentId) return;

    const id = parseInt(selectedInstrumentId);
    if (!allInstruments.find((i) => i.id === id)) return;

    setPendingAddInstruments((p) => [...p, id]);
    setUserInstruments((p) => [...p, allInstruments.find((i) => i.id === id)!]);
    setSelectedInstrumentId("");
  };

  const handleRemoveInstrument = (id: number) => {
    setPendingRemoveInstruments((p) => [...p, id]);
    setUserInstruments((p) => p.filter((i) => i.id !== id));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/25 backdrop-blur-md z-50">
      <div className="bg-white rounded-xl border border-blue-100 shadow-2xl max-w-4xl w-full p-0 overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex items-center gap-3">
          <div className="bg-white/30 rounded-full p-2">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-sans">Editar Usuario</h2>
            <p className="text-blue-100 text-xs font-sans">Actualiza la información del usuario</p>
          </div>
          <button
            className="ml-auto bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            onClick={() => setShowEditModal(false)}
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Body grid */}
        <div className="px-6 py-6 font-sans grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1: Info personal y ubicación */}
          <div className="space-y-6">
            <section className="bg-white rounded-lg shadow-sm p-4 border border-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <User className="text-blue-500" size={16} />
                <h3 className="font-semibold text-blue-700 text-base">Información Personal</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="font-semibold text-xs mb-1 block text-gray-600">
                    Nombre completo
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-sans text-sm"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs mb-1 block text-gray-600">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-sans text-sm"
                    placeholder="Dejar vacío para no cambiar"
                    value={selectedUser.password || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        password: e.target.value
                      })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs mb-1 block text-gray-600">
                    Rol
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-sans text-sm cursor-pointer"
                    value={selectedUser.rol}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, rol: e.target.value })
                    }
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                  </select>
                </div>
              </div>
            </section>
            <section className="bg-white rounded-lg shadow-sm p-4 border border-green-50">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-green-500" size={16} />
                <h3 className="font-semibold text-green-700 text-base">Ubicación y Sitio</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="font-semibold text-xs mb-1 block text-gray-600">
                    Sitio
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-green-100 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 font-sans text-sm cursor-pointer"
                    value={selectedUser.site_id || ""}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      const sitio = sitios.find((s) => s.id === id);
                      if (!sitio) return;
                      setSelectedUser({ ...selectedUser, site_id: id, site: sitio });
                    }}
                  >
                    <option value="">Seleccionar sitio</option>
                    {sitios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.zona?.locality} — {s.latitude}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-xs mb-1 block text-gray-600">
                    Zona
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-green-100 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 font-sans text-sm cursor-pointer"
                    value={zonaSeleccionada?.id || ""}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      const zona = zonas.find((z) => z.id === id) || undefined;
                      setZonaSeleccionada(zona || null);
                      setSelectedUser({ ...selectedUser, zona_id: id, zona });
                    }}
                  >
                    <option value="">Seleccionar zona</option>
                    {zonas.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.locality}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-2 flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1">Latitud</span>
                  <span className="font-bold text-gray-900 text-xs">
                    {selectedUser.site?.latitude || 'N/A'}
                  </span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-2 flex flex-col items-start">
                  <span className="text-xs text-gray-500 mb-1">Longitud</span>
                  <span className="font-bold text-gray-900 text-xs">
                    {selectedUser.site?.longitude || 'N/A'}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Columna 2: Instrumentos y acciones */}
          <div className="space-y-6 flex flex-col h-full">
            <section className="bg-white rounded-lg shadow-sm p-4 border border-purple-50 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="text-purple-500" size={16} />
                <h3 className="font-semibold text-purple-700 text-base">Instrumentos</h3>
              </div>
              {loadingInstruments ? (
                <p className="text-gray-600 text-center text-sm">Cargando...</p>
              ) : (
                <>
                  {userInstruments.length === 0 ? (
                    <p className="text-gray-600 text-sm">No tiene instrumentos asignados.</p>
                  ) : (
                    <div className="space-y-2">
                      {userInstruments.map((inst) => (
                        <div
                          key={inst.id}
                          className="bg-white border border-blue-50 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div>
                            <p className="font-bold text-xs text-gray-900">{inst.name}</p>
                            <p className="text-xs text-gray-500">
                              {inst.brand} {inst.model}
                            </p>
                          </div>
                          <button
                            className="p-2 bg-gray-100 text-red-500 rounded-md hover:bg-red-100 transition-all duration-200"
                            onClick={() => handleRemoveInstrument(inst.id)}
                            title="Quitar instrumento"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 bg-blue-50 border border-blue-200 p-2 rounded-md flex gap-2">
                    <select
                      className="w-full px-3 py-2 bg-white border border-blue-100 rounded-md text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-sans text-sm cursor-pointer"
                      value={selectedInstrumentId}
                      onChange={(e) => setSelectedInstrumentId(e.target.value)}
                    >
                      <option value="">Seleccionar instrumento</option>
                      {allInstruments
                        .filter(i => !userInstruments.some(u => u.id === i.id))
                        .map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name} — {i.brand}
                          </option>
                        ))}
                    </select>
                    <button
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-200 text-sm"
                      onClick={handleAddInstrument}
                      disabled={!selectedInstrumentId || userInstruments.some(u => u.id === parseInt(selectedInstrumentId))}
                    >
                      <Plus size={14} />
                      Agregar
                    </button>
                  </div>
                </>
              )}
            </section>

            {/* Footer solo en columna 2 */}
            <div className="bg-white border-t border-blue-100 px-0 py-4 flex justify-end gap-3">
              <button
                className="px-5 py-2 bg-white border border-blue-100 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 text-sm"
                onClick={() => setShowEditModal(false)}
              >
                <X size={16} /> Cancelar
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 text-sm"
                onClick={handleSave}
              >
                <Save size={16} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        {/* Spinner overlay al guardar */}
        {isSaving && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 flex flex-col items-center shadow-2xl">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-base font-semibold text-blue-700">Guardando cambios...</span>
            </div>
          </div>
        )}

        {/* Modal de éxito/error */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100]">
            <div className="bg-white rounded-xl p-4 text-center max-w-xs shadow-xl">
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${modalType === "success" ? "bg-green-100" : "bg-red-100"}`}
              >
                {modalType === "success" ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <p className="text-base font-semibold">{modalMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormEditUser;
