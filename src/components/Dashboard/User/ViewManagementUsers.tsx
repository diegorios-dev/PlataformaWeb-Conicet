import { useState, useEffect } from "react";
import {
  getUsersByWord,
  saveUser,
  getAllUsers,
  deleteUser,
} from "../../../services/userService";
import FormEditUser from "./FormEditUser";
import SearchUser from "./searchUser";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";
import IconNavMenu from "../../Menu/IconNavMenu";

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
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type ModalType = "success" | "error" | "confirm" | null;

const ViewManagementUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const { goAddUser } = useNavegation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data.users) ? data.users : data);
    } catch {
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
    if (type !== "confirm") {
      setTimeout(() => setModalOpen(false), 2800);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction) confirmAction();
    closeModal();
  };

  const handleOptionUser = async (option, user) => {
    if (option === "editar") {
      setSelectedUser({
        ...user,
        site: user.site ? { ...user.site } : null,
        zona: user.zona ? { ...user.zona } : null,
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
            showModal("success", "Usuario eliminado", `Usuario ${user.name} eliminado exitosamente`);
            await fetchUsers();
          } catch {
            showModal("error", "Error al eliminar", "No se pudo eliminar el usuario. Por favor intenta nuevamente.");
          } finally {
            setDeleting(false);
          }
        }
      );
    }
  };

  const search = async (word) => {
    setLoading(true);
    try {
      if (!word.trim()) return await fetchUsers();
      const data = await getUsersByWord(word);
      setUsers(Array.isArray(data.users) ? data.users : data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
        <div className="bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center shadow-xl">
          <div className="bg-slate-100 rounded-full p-6 mb-4 shadow-lg shadow-slate-500/10">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <p className="text-xl font-semibold text-slate-700">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !users || users.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      <IconNavMenu />
      <div className="w-full max-w-7xl mx-auto">
        <BackButton />
        
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
              onClick={goAddUser}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-green-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 text-base group"
            >
              <UserPlus size={20} className="transition-transform group-hover:rotate-12" />
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
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl">
            <div className="bg-slate-100 rounded-full p-6 mb-4 shadow-lg shadow-slate-500/10">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay usuarios registrados</h3>
            <p className="text-base text-slate-500 mb-6">Agregá tu primer usuario para comenzar</p>
            <button
              onClick={goAddUser}
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        Usuario
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Shield size={14} />
                        Rol
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Key size={14} />
                        Contraseña
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        Ubicación
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Zona
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">
                          #{user.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <User size={16} className="text-blue-600" />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                            user.rol === "admin"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          <Shield size={12} />
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
                          <Key size={12} />
                          {user.password}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            Lat: {user.site?.latitude || 'N/A'}
                          </span>
                          <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            Lng: {user.site?.longitude || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                          <MapPin size={12} />
                          {user.zona?.locality || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOptionUser("editar", user)}
                            className="group flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200 transition-all duration-200"
                          >
                            <Pencil size={14} className="transition-transform group-hover:rotate-12" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleOptionUser("eliminar", user)}
                            disabled={deleting}
                            className="group flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold border border-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Modal mejorado */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={modalType !== 'confirm' ? closeModal : undefined}
        >
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300">
            {modalType !== 'confirm' && (
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <X size={20} />
              </button>
            )}
            
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl mb-4 ${
                modalType === 'success' 
                  ? 'bg-green-100' 
                  : modalType === 'error'
                  ? 'bg-red-100'
                  : 'bg-amber-100'
              }`}>
                {modalType === 'success' ? (
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                ) : modalType === 'error' ? (
                  <AlertCircle className="w-12 h-12 text-red-600" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-amber-600" />
                )}
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 ${
                modalType === 'success' 
                  ? 'text-green-900' 
                  : modalType === 'error'
                  ? 'text-red-900'
                  : 'text-amber-900'
              }`}>
                {modalTitle}
              </h3>
              <p className={`text-base mb-6 ${
                modalType === 'success' 
                  ? 'text-green-700' 
                  : modalType === 'error'
                  ? 'text-red-700'
                  : 'text-amber-700'
              }`}>
                {modalMessage}
              </p>
              
              <div className="flex justify-center gap-3 w-full">
                {modalType === 'confirm' ? (
                  <>
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
                  </>
                ) : (
                  <button
                    onClick={closeModal}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105 shadow-lg ${
                      modalType === 'success'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-600/30'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/30'
                    }`}
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <FormEditUser
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setShowEditModal={setShowEditModal}
          saveUser={saveUser}
          onSave={fetchUsers}
        />
      )}
    </div>
  );
};

export default ViewManagementUsers;