import { useState, useEffect } from "react";
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

const inputClass =
  "border border-gray-200 bg-white rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 placeholder-gray-400 transition shadow-sm";

const selectClass =
  "border border-gray-200 bg-white rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 transition shadow-sm cursor-pointer";

const buttonClass =
  "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition shadow hover:shadow-lg";

const FormEditUser = ({
  selectedUser,
  setSelectedUser,
  setShowEditModal,
  saveUser,
  onSave
}) => {
  const [sitios, setSitios] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  // Estados para instrumentos
  const [allInstruments, setAllInstruments] = useState([]);
  const [userInstruments, setUserInstruments] = useState([]);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState("");
  const [loadingInstruments, setLoadingInstruments] = useState(false);

  // Estados para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  // Cargar sitios al montar el componente
  useEffect(() => {
    const fetchSitios = async () => {
      try {
        const data = await getAllSitios();
        setSitios(data);
        
        // Establecer la zona inicial basada en el sitio actual del usuario
        if (selectedUser?.site_id) {
          const sitioActual = data.find(s => s.id === selectedUser.site_id);
          if (sitioActual) {
            setZonaSeleccionada(sitioActual.zona);
          }
        }
      } catch (error) {
        console.error("Error al cargar sitios:", error);
      }
    };
    fetchSitios();
  }, [selectedUser?.site_id]);

  // Cargar instrumentos disponibles y del usuario
  useEffect(() => {
    const fetchInstruments = async () => {
      if (!selectedUser?.id) return;
      
      setLoadingInstruments(true);
      try {
        // Cargar todos los instrumentos disponibles
        const allInstrumentsData = await getAllInstruments();
        setAllInstruments(allInstrumentsData.instruments || allInstrumentsData || []);

        // Cargar instrumentos del usuario
        const userInstrumentsData = await getUserInstruments(selectedUser.id);
        setUserInstruments(userInstrumentsData.instruments || []);
      } catch (error) {
        console.error("Error al cargar instrumentos:", error);
        showModal("error", "Error al cargar instrumentos");
      } finally {
        setLoadingInstruments(false);
      }
    };

    fetchInstruments();
  }, [selectedUser?.id]);

  const handleSiteChange = (e) => {
    const siteId = parseInt(e.target.value);
    const sitioSeleccionado = sitios.find(s => s.id === siteId);
    
    if (sitioSeleccionado) {
      // Crear copias profundas para evitar mutaciones
      setSelectedUser({
        ...selectedUser,
        site_id: siteId,
        zona_id: sitioSeleccionado.zona_id,
        site: { ...sitioSeleccionado },
        zona: { ...sitioSeleccionado.zona }
      });
      setZonaSeleccionada({ ...sitioSeleccionado.zona });
    }
  };

  const showModal = (type: "success" | "error", message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);
    setTimeout(() => {
      setModalOpen(false);
      if (type === "success") {
        setShowEditModal(false);
        if (onSave) {
          onSave(); // Recargar la lista de usuarios
        }
      }
    }, 3000);
  };

  const handleSave = async () => {
    try {
      // Asegurarnos de que tenemos los IDs correctos
      const userToSave = {
        ...selectedUser,
        site_id: selectedUser.site_id,
        zona_id: selectedUser.zona_id
      };
      
      await saveUser(userToSave);
      showModal("success", "Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      showModal("error", "Error al actualizar usuario");
    }
  };

 const handleAddInstrument = async () => {
  if (!selectedInstrumentId || !selectedUser?.id) return;

  try {
    await assignInstrumentToUser(selectedUser.id, parseInt(selectedInstrumentId));
    
    const updatedInstruments = await getUserInstruments(selectedUser.id);
    setUserInstruments(updatedInstruments.instruments || []);
    
    setSelectedInstrumentId('');
    
    showModal("success", "Instrumento asignado correctamente");
    
  } catch (error: any) {
    console.error('Error al asignar instrumento:', error);
    
    if (error.response?.status === 409) {
      showModal("error", "El instrumento ya está asignado a este usuario");
    } else {
      showModal("error", "No se pudo asignar el instrumento");
    }
  }
};

  // Quitar instrumento del usuario
  const handleRemoveInstrument = async (instrumentId: number) => {
    if (!selectedUser?.id) return;

    if (!confirm("¿Está seguro de quitar este instrumento del usuario?")) {
      return;
    }

    try {
      await removeInstrumentFromUser(selectedUser.id, instrumentId);
      
      // Quitar el instrumento de la lista local
      setUserInstruments(userInstruments.filter(inst => inst.id !== instrumentId));
      
      showModal("success", "Instrumento quitado correctamente");
    } catch (error) {
      console.error("Error al quitar instrumento:", error);
      showModal("error", "Error al quitar instrumento");
    }
  };
  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200";
  const selectClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 cursor-pointer";
  const buttonClass = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg";


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop mejorado con gradiente */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/50 to-gray-900/60 backdrop-blur-md"
        onClick={() => setShowEditModal(false)}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden ">
        
        {/* Header con gradiente */}
        <div className="bg-blue-500 px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <User className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Editar Usuario
                </h2>
                <p className="text-blue-100 text-sm mt-0.5">
                  Actualiza la información del usuario
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido con scroll personalizado */}
        <div className="overflow-y-auto max-h-[calc(92vh-180px)] px-8 py-6">
          
          {/* Sección: Información Personal */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <User className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Información Personal
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="text-blue-600" size={16} />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Nombre del usuario"
                  value={selectedUser?.name || ""}
                  onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <KeyRound className="text-blue-600" size={16} />
                  Contraseña
                </label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Nueva contraseña"
                  value={selectedUser?.password || ""}
                  onChange={e => setSelectedUser({ ...selectedUser, password: e.target.value })}
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1.5 ml-1">
                  Deja vacío para mantener la contraseña actual
                </p>
              </div>

              {/* Rol */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="text-blue-600" size={16} />
                  Rol de Usuario
                </label>
                <select
                  className={selectClass}
                  value={selectedUser?.rol || ""}
                  onChange={e => setSelectedUser({ ...selectedUser, rol: e.target.value })}
                >
                  <option value="">Seleccionar rol</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8" />

          {/* Sección: Ubicación */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <MapPin className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Ubicación y Sitio
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sitio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Locate className="text-green-600" size={16} />
                  Sitio de Trabajo
                </label>
                <select className={selectClass} value={selectedUser?.site_id || ""}>
                  <option value="">Seleccionar sitio</option>
                  {sitios.map(sitio => (
                    <option key={sitio.id} value={sitio.id}>
                      {sitio.zona?.locality} - Lat: {sitio.latitude}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1.5 ml-1">
                  La zona se actualiza automáticamente
                </p>
              </div>

              {/* Zona */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="text-green-600" size={16} />
                  Zona Asignada
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  value={zonaSeleccionada?.locality || ""}
                  disabled
                />
              </div>

              {/* Coordenadas */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MapPinned className="text-green-600" size={16} />
                  Coordenadas del Sitio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-1">Latitud</p>
                    <p className="text-sm font-bold text-gray-900">{selectedUser?.site?.latitude || 'N/A'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-1">Longitud</p>
                    <p className="text-sm font-bold text-gray-900">{selectedUser?.site?.longitude || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8" />

          {/* Sección: Instrumentos */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Wrench className="text-purple-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Instrumentos Asignados
              </h3>
            </div>

            {/* Lista de instrumentos */}
            <div className="mb-6">
              {loadingInstruments ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Cargando instrumentos...
                </div>
              ) : userInstruments.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border border-gray-200">
                  <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No tiene instrumentos asignados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userInstruments.map((instrument) => (
                    <div
                      key={instrument.id}
                      className="group bg-white border border-gray-200 rounded-2xl px-5 py-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                              <Wrench className="text-blue-600" size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{instrument.name}</p>
                              <p className="text-sm text-gray-600">
                                {instrument.brand} {instrument.model && `· ${instrument.model}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-13">
                            {instrument.tipo_evento && (
                              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {instrument.tipo_evento}
                              </span>
                            )}
                            {instrument.unidad_medida && (
                              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {instrument.unidad_medida.name} ({instrument.unidad_medida.symbol})
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveInstrument(instrument.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 ml-4"
                          title="Quitar instrumento"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Agregar instrumento */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <label className="text-sm font-bold text-gray-900 mb-3 block">
                Asignar Nuevo Instrumento
              </label>
              <div className="flex gap-3">
                <select
                  className={`${selectClass} flex-1`}
                  value={selectedInstrumentId}
                  onChange={(e) => setSelectedInstrumentId(e.target.value)}
                  disabled={allInstruments.length === 0}
                >
                  <option value="">
                    {allInstruments.length === 0 ? "No hay instrumentos disponibles" : "Seleccionar instrumento"}
                  </option>
                  {allInstruments.map((instrument) => (
                    <option key={instrument.id} value={instrument.id}>
                      {instrument.name} {instrument.brand && `- ${instrument.brand}`}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddInstrument}
                  disabled={!selectedInstrumentId}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer fijo */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 border border-gray-200 shadow-sm hover:shadow"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación mejorado */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                modalType === "success" ? "bg-green-100" : "bg-red-100"
              }`}>
                {modalType === "success" ? (
                  <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={2.5} />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-red-600" strokeWidth={2.5} />
                )}
              </div>

              <h3 className={`text-2xl font-bold mb-2 ${
                modalType === "success" ? "text-green-900" : "text-red-900"
              }`}>
                {modalType === "success" ? "¡Perfecto!" : "Error"}
              </h3>
              <p className={`text-base ${
                modalType === "success" ? "text-green-700" : "text-red-700"
              }`}>
                {modalMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
    
};

export default FormEditUser;