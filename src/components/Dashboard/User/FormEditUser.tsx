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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur"
        onClick={() => setShowEditModal(false)}
      />

      {/* CONTENEDOR */}
      <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-xl">
        {/* HEADER */}
        <div className="bg-blue-500 px-8 py-6 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">Editar Usuario</h2>

          <button
            className="bg-white/20 hover:bg-white/30 p-2 rounded-xl"
            onClick={() => setShowEditModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto px-8 py-6 max-h-[calc(92vh-160px)]">
          {/* --- INFO PERSONAL --- */}
          <div className="mb-6">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-blue-700 text-lg">
              <User className="text-blue-500" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-xs mb-1 block text-gray-600">
                  Nombre completo
                </label>
                <input
                  className={inputClass}
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
                  className={inputClass}
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

              <div className="md:col-span-2">
                <label className="font-semibold text-xs mb-1 block text-gray-600">
                  Rol
                </label>
                <select
                  className={selectClass}
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
          </div>

          <hr className="my-6" />

          {/* --- UBICACION --- */}
          <div className="mb-6">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-green-700 text-lg">
              <MapPin className="text-green-500" />
              Ubicación y Sitio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sitio */}
              <div>
                <label className="font-semibold text-xs mb-1 block text-gray-600">
                  Sitio
                </label>
                <select
                  className={selectClass}
                  value={selectedUser.site_id || ""}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const sitio = sitios.find((s) => s.id === id);
                    if (!sitio) return;

                    setSelectedUser({
                      ...selectedUser,
                      site_id: id,
                      site: sitio
                    });
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

              {/* Zona */}
              <div>
                <label className="font-semibold text-xs mb-1 block text-gray-600">
                  Zona
                </label>
                <select
                  className={selectClass}
                  value={zonaSeleccionada?.id || ""}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const zona = zonas.find((z) => z.id === id) || null;
                    setZonaSeleccionada(zona);
                    setSelectedUser({
                      ...selectedUser,
                      zona_id: id,
                      zona
                    });
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
          </div>

          <hr className="my-6" />

          {/* --- INSTRUMENTOS --- */}
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2 text-purple-700 text-lg">
              <Wrench className="text-purple-500" />
              Instrumentos
            </h3>

            {loadingInstruments ? (
              <p className="text-gray-600 text-center">Cargando...</p>
            ) : (
              <>
                {userInstruments.length === 0 ? (
                  <p className="text-gray-600">No tiene instrumentos asignados.</p>
                ) : (
                  <div className="space-y-2">
                    {userInstruments.map((inst) => (
                      <div
                        key={inst.id}
                        className="bg-white border rounded-lg px-3 py-2 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-sm">{inst.name}</p>
                          <p className="text-xs text-gray-500">
                            {inst.brand} {inst.model}
                          </p>
                        </div>

                        <button
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          onClick={() => handleRemoveInstrument(inst.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Agregar instrumento */}
                <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg flex gap-2">
                  <select
                    className={selectClass}
                    value={selectedInstrumentId}
                    onChange={(e) => setSelectedInstrumentId(e.target.value)}
                  >
                    <option value="">Seleccionar instrumento</option>
                    {allInstruments.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} — {i.brand}
                      </option>
                    ))}
                  </select>

                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    onClick={handleAddInstrument}
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            className="px-6 py-3 bg-white border rounded-xl hover:bg-gray-100"
            onClick={() => setShowEditModal(false)}
          >
            <X size={18} /> Cancelar
          </button>

          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
            onClick={handleSave}
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100]">
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                modalType === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {modalType === "success" ? (
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-red-600" />
              )}
            </div>

            <p className="text-lg font-semibold">{modalMessage}</p>
          </div>
        </div>
      )}

      {/* SPINNER GUARDANDO */}
      {isSaving && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-lg font-semibold text-blue-700">Guardando cambios...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormEditUser;
