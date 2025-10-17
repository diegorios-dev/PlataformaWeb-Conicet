import { useState } from "react";
import { getUsersByWord, saveUser } from "../../../services/userService";
import useUsers from "../../../hooks/useUsers";
import FormEditUser from "./FormEditUser";
import SearchUser from "./searchUser";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";

import {
  UserPlus,
  Pencil,
  Trash2,
  Users,
  Loader2,
  Search,
  MapPin,
  Shield,
  User,
  Key,
  AlertCircle
} from "lucide-react";

const ViewManagementUsers = () => {
  const { users, loading, handleSetUser, fetchUsers } = useUsers([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { goAddUser, goBack } = useNavegation();

  const isLoading = loading;
  const isEmpty = !users || users.length === 0;
  const visibleUsers = users;

  const handleOptionUser = async (option, user) => {
    if (option === "editar") {
      setSelectedUser(user);
      setShowEditModal(true);
    }
    if (option === "eliminar") {
      if (confirm(`¿Seguro que querés eliminar a ${user.name}?`)) {
        setDeleting(true);
        // Aquí iría la lógica de eliminación
        setTimeout(() => setDeleting(false), 1000);
      }
    }
  };

  const search = async (word) => {
    try {
      if (!word || word.trim() === "") {
        await fetchUsers();
      } else {
        const data = await getUsersByWord(word);
        handleSetUser(Array.isArray(data.users) ? data.users : []);
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      alert("No se pudo buscar usuarios");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-lg font-semibold text-slate-700">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Gestión de Usuarios</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Tarjeta de controles */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              
              {/* Botón agregar */}
              <button
                onClick={goAddUser}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <UserPlus size={20} className="transition-transform group-hover:scale-110" />
                Agregar Usuario
              </button>

              {/* Buscador */}
              <div className="flex-1 w-full lg:max-w-md">
                <SearchUser onSearch={search} />
              </div>

              {/* Contador */}
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-700">
                  {visibleUsers?.length || 0} {visibleUsers?.length === 1 ? 'usuario' : 'usuarios'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          {isEmpty ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-12 flex flex-col items-center justify-center">
              <div className="bg-slate-100 rounded-full p-6 mb-4">
                <Users className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay usuarios registrados</h3>
              <p className="text-sm text-slate-500 mb-6">Comienza agregando tu primer usuario</p>
              <button
                onClick={goAddUser}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <UserPlus size={20} />
                Agregar Primer Usuario
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
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
                  <tbody className="divide-y divide-slate-100">
                    {Array.isArray(visibleUsers) &&
                      visibleUsers.map((user, index) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50 transition-colors duration-150"
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
                                Lat: {user.site.latitude}
                              </span>
                              <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                Lng: {user.site.longitude}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                              <MapPin size={12} />
                              {user.zona.locality}
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
                                className="group flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold border border-red-200 transition-all duration-200 disabled:opacity-50"
                              >
                                <Trash2 size={14} className="transition-transform group-hover:scale-110" />
                                Eliminar
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Gestión de Usuarios</h4>
                <p className="text-xs text-blue-800">
                  Administra los usuarios del sistema. Los usuarios de tipo "admin" tienen acceso completo, 
                  mientras que los usuarios regulares tienen permisos limitados. Asegúrate de asignar los roles correctamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <FormEditUser
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setShowEditModal={setShowEditModal}
          saveUser={saveUser}
        />
      )}
    </div>
  );
};

export default ViewManagementUsers;