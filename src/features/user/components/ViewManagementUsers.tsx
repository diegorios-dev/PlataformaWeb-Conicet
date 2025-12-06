import { useState, useEffect, useRef } from "react";
import {
  getUsersByWord,
  saveUser,
  getAllUsers,
  deleteUser,
} from "@features/user/services";
import type { UserType } from "@features/user/types/user.types";
import FormEditUser from "./FormEditUser";
import SearchUser from "./searchUser";
import { useNavegation } from "@shared/hooks";
import { DashboardLayout } from "@shared/ui/layouts/DashboardLayout/DashboardLayout";
import { devLog } from "@shared/utils/errorHandler";
import Toast from "@shared/ui/Loading/Toast";
import {
  UserPlus,
  Pencil,
  Trash2,
  Users,
  Loader2,
  MapPin,
  Shield,
  User,
  Key,
  AlertCircle,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  Map,
} from "lucide-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

type ModalType = "confirm" | null;

// Componente Modal para mostrar el mapa con Leaflet
const MapModal = ({ 
  isOpen, 
  onClose, 
  latitude, 
  longitude, 
  siteName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  latitude: number | string; 
  longitude: number | string; 
  siteName: string;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current || mapInstanceRef.current) return;

    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;

    // Pequeño delay para asegurar que el DOM está listo
    setTimeout(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Inicializar mapa
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Agregar capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Agregar marcador personalizado
      const customIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            width: 48px;
            height: 48px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 5px solid white;
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 16px;
              height: 16px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48]
      });

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        
        .openPopup();

      mapInstanceRef.current = map;
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, latitude, longitude, siteName]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Backdrop blureado */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-slate-900/60 backdrop-blur-md" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con diseño mejorado */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-8 py-6 overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full translate-y-24 -translate-x-24 blur-2xl" />
          
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Ícono principal con animación */}
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg shadow-blue-900/30 border border-white/30">
                <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{siteName}</h3>
                  <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/30">
                    Ubicación
                  </span>
                </div>
                
                {/* Grid de información */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {/* Latitud */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-xs font-medium text-blue-100 uppercase tracking-wide">Latitud</span>
                    </div>
                    <p className="text-base font-bold text-white font-mono">{typeof latitude === 'string' ? parseFloat(latitude).toFixed(6) : latitude.toFixed(6)}</p>
                  </div>
                  
                  {/* Longitud */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                      <span className="text-xs font-medium text-blue-100 uppercase tracking-wide">Longitud</span>
                    </div>
                    <p className="text-base font-bold text-white font-mono">{typeof longitude === 'string' ? parseFloat(longitude).toFixed(6) : longitude.toFixed(6)}</p>
                  </div>
                </div>

              
               
              </div>
            </div>
            
            {/* Botón cerrar mejorado */}
            <button
              onClick={onClose}
              className="relative bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-white/20 group"
              title="Cerrar"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Contenedor del mapa */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 z-10" />
          <div ref={mapRef} style={{ height: '550px', width: '100%' }} className="relative z-0" />
        </div>

      </div>
    </div>
  );
};

const ViewManagementUsers = () => {

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{latitude: string;longitude: string;siteName: string} | null>(null);

  // Estados para modal de confirmación
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  
  // Estados para Toast (success/error)
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const { go } = useNavegation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      // El backend retorna {users: [...]}
      const usersList = (data && typeof data === 'object' && 'users' in data) ? data.users : data;
      setUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      devLog.error('Error cargando usuarios', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (
    type: ModalType,
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
    if (onConfirm) setConfirmAction(() => onConfirm);
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToastType(type);
    setToastMessage(message);
    setToastOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction) confirmAction();
    closeModal();
  };

  const handleOptionUser = async (option: string, user: UserType) => {
    if (option === "editar") {
      setSelectedUser({
        ...user,
        site: user.site ? { ...user.site } : undefined,
        zona: user.zona ? { ...user.zona } : undefined,
      });
      setShowEditModal(true);
    }

    if (option === "eliminar") {
      showModal(
        "confirm",
        "Confirmar eliminación",
        `¿Estás seguro que querés eliminar a ${user.name}? Esta acción no se puede deshacer.`,
        async () => {
          setDeleting(true);
          try {
            await deleteUser(user.id);
            showToast("success", `Usuario ${user.name} eliminado exitosamente`);
            await fetchUsers();
          } catch {
            showToast("error", "No se pudo eliminar el usuario. Por favor intenta nuevamente.");
          } finally {
            setDeleting(false);
          }
        }
      );
    }
  };

  const search = async (word: string) => {
    setLoading(true);
    try {
      if (!word.trim()) {
        await fetchUsers();
        return;
      }
      const data = await getUsersByWord(word);
      // El backend retorna {users: [...]}
      const usersList = (data && typeof data === 'object' && 'users' in data) ? data.users : data;
      setUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      devLog.error('Error buscando usuarios', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (userId: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const openMapModal = (latitude: string, longitude: string, siteName: string) => {
    setSelectedMapLocation({ latitude, longitude, siteName });
    setMapModalOpen(true);
  };

  const closeMapModal = () => {
    setMapModalOpen(false);
    setSelectedMapLocation(null);
  };

  const isEmpty = !users || users.length === 0;

  return (
    <DashboardLayout contentClassName="">
      <div className="w-full max-w-7xl mx-auto">  
        {/* Header mejorado - copiado de ShowReport */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Gestión de Usuarios
              </h1>
              <p className="text-base text-slate-600 mt-1 font-medium">
                {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
              </p>
            </div>
          </div>
        </div>

        {/* Controles de búsqueda - estilo mejorado */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8 mb-6">
          
          {/* Barra de acciones */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
            <button
              onClick={go.users.add}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-2xl font-bold shadow-lg shadow-sky-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 text-base group"
            >
              <UserPlus size={20} className="transition-transform group-hover:rotate-6" />
              Nuevo Usuario
            </button>

            <div className="flex-1 max-w-md">
              <SearchUser onSearch={search} />
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="pt-6 border-t border-slate-200">
            <span className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 bg-blue-50 px-5 py-3 rounded-xl">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              {users.length} {users.length === 1 ? "usuario" : "usuarios"}
            </span>
          </div>
        </div>

        {/* Tabla de usuarios - MANTIENE LA ESTRUCTURA ORIGINAL */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px] bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl">
            <div className="text-center p-10">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Cargando usuarios...</p>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl">
            <div className="bg-slate-100 rounded-full p-6 mb-4 shadow-lg shadow-slate-500/10">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay usuarios registrados</h3>
            <p className="text-base text-slate-500 mb-6">Agregá tu primer usuario para comenzar</p>
            <button
              onClick={go.users.add}
              className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 text-base"
            >
              <UserPlus size={20} />
              Agregar Usuario
            </button>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        Usuario
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">
                      <div className="flex items-center justify-center gap-2">
                        <Shield size={14} />
                        Rol
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-48">
                      <div className="flex items-center gap-2">
                        <Key size={14} />
                        Contraseña
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">
                      <div className="flex items-center justify-center gap-2">
                        <MapPin size={14} />
                        Zona
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-44">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-colors duration-150"
                    >
                      <td className="px-4 py-5 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200">
                          {user.id}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2.5 rounded-lg border border-blue-200">
                            <User size={18} className="text-blue-700" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">
                              {user.name}
                            </span>
                            {user.site?.nombre && (
                              <span className="text-xs text-slate-500 font-medium">
                                {user.site.nombre}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                            user.rol === "admin"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          <Shield size={13} />
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="relative group inline-flex items-center gap-2">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 text-slate-700 text-xs font-mono border border-slate-200 min-w-[140px]">
                            <Key size={13} className="text-slate-400" />
                            {visiblePasswords[user.id] ? user.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-slate-100 rounded-lg flex-shrink-0 border border-transparent hover:border-slate-200"
                            title={visiblePasswords[user.id] ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {visiblePasswords[user.id] ? (
                              <EyeOff size={15} className="text-slate-600" />
                            ) : (
                              <Eye size={15} className="text-slate-600" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                            <MapPin size={13} />
                            {user.zona?.locality || 'N/A'}
                          </span>
                          {user.site?.latitude && user.site?.longitude && (
                            <button
                              onClick={() => user.site && openMapModal(
                                user.site.latitude, 
                                user.site.longitude,
                                user.site.nombre || "Ubicación"
                              )}
                              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold hover:scale-105 transition-all duration-200"
                              title="Ver ubicación en el mapa"
                            >
                              <Map size={12} />
                              Mapa
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOptionUser("editar", user)}
                            className="group flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200 hover:border-amber-300 transition-all duration-200"
                          >
                            <Pencil size={14} className="transition-transform group-hover:rotate-12" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleOptionUser("eliminar", user)}
                            disabled={deleting}
                            className="group flex items-center gap-1.5 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-semibold border border-red-200 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleting ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} className="transition-transform group-hover:scale-110" />
                            )}
                            {deleting ? "..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-3 rounded-xl shadow-sm flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-blue-900 mb-1">Gestión de Usuarios</h4>
              <p className="text-sm text-blue-800">
                Administra los usuarios del sistema. Los usuarios de tipo "admin" tienen acceso completo, 
                mientras que los usuarios regulares tienen permisos limitados. Asegúrate de asignar los roles correctamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {modalOpen && modalType === 'confirm' && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300">
            
            <div className="flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl mb-4 bg-amber-100">
                <AlertTriangle className="w-12 h-12 text-amber-600" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-amber-900">
                {modalTitle}
              </h3>
              <p className="text-base mb-6 text-amber-700">
                {modalMessage}
              </p>
              
              <div className="flex justify-center gap-3 w-full">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedUser && (
        <FormEditUser
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setShowEditModal={setShowEditModal}
          saveUser={saveUser}
          onSave={fetchUsers}
        />
      )}

      {/* Modal del mapa */}
      {selectedMapLocation && (
        <MapModal
          isOpen={mapModalOpen}
          onClose={closeMapModal}
          latitude={selectedMapLocation.latitude}
          longitude={selectedMapLocation.longitude}
          siteName={selectedMapLocation.siteName}
        />
      )}

      {/* Toast para notificaciones */}
      <Toast
        isOpen={toastOpen}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </DashboardLayout>
  );
};

export default ViewManagementUsers;