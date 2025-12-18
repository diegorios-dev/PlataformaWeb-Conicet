import { useState, useEffect, useCallback } from "react";
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
  Users,
  Loader2,
  MapPin,
  Shield,
  User,
  Key,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

// ✅ OPTIMIZACIÓN: Importar componentes memoizados desde archivos separados
import { MapModal } from "./MapModal";
import { UserRow } from "./UserRow";

type ModalType = "confirm" | null;

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

  // ✅ OPTIMIZACIÓN: fetchUsers con useCallback
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      const usersList = (data && typeof data === 'object' && 'users' in data) ? data.users : data;
      setUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      devLog.error('Error cargando usuarios', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ OPTIMIZACIÓN: showModal con useCallback
  const showModal = useCallback((
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
  }, []);

  // ✅ OPTIMIZACIÓN: showToast con useCallback
  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToastType(type);
    setToastMessage(message);
    setToastOpen(true);
  }, []);

  // ✅ OPTIMIZACIÓN: closeModal con useCallback
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setConfirmAction(null);
  }, []);

  // ✅ OPTIMIZACIÓN: handleConfirm con useCallback
  const handleConfirm = useCallback(() => {
    if (confirmAction) confirmAction();
    closeModal();
  }, [confirmAction, closeModal]);

  // ✅ OPTIMIZACIÓN: handleOptionUser con useCallback
  const handleOptionUser = useCallback(async (option: string, user: UserType) => {
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
  }, [showModal, showToast, fetchUsers]);

  // ✅ OPTIMIZACIÓN: search con useCallback
  const search = useCallback(async (word: string) => {
    setLoading(true);
    try {
      if (!word.trim()) {
        await fetchUsers();
        return;
      }
      const data = await getUsersByWord(word);
      const usersList = (data && typeof data === 'object' && 'users' in data) ? data.users : data;
      setUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      devLog.error('Error buscando usuarios', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // ✅ OPTIMIZACIÓN: togglePasswordVisibility con useCallback
  const togglePasswordVisibility = useCallback((userId: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  }, []);

  // ✅ OPTIMIZACIÓN: openMapModal con useCallback
  const openMapModal = useCallback((latitude: string, longitude: string, siteName: string) => {
    setSelectedMapLocation({ latitude, longitude, siteName });
    setMapModalOpen(true);
  }, []);

  // ✅ OPTIMIZACIÓN: closeMapModal con useCallback
  const closeMapModal = useCallback(() => {
    setMapModalOpen(false);
    setSelectedMapLocation(null);
  }, []);

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
                  {/* ✅ OPTIMIZACIÓN: Usar componente UserRow memoizado */}
                  {users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      isPasswordVisible={visiblePasswords[user.id] || false}
                      isDeleting={deleting}
                      onTogglePassword={togglePasswordVisibility}
                      onEdit={handleOptionUser}
                      onDelete={handleOptionUser}
                      onViewMap={openMapModal}
                    />
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