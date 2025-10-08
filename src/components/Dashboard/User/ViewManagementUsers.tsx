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
} from "lucide-react";

const ViewManagementUsers = () => {
  const { users, loading, handleSetUser, fetchUsers } = useUsers([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { goAddUser, goBack } = useNavegation();

  const isLoading = loading;
  const isEmpty = !users || users.length === 0;

  const visibleUsers = users;

  const handleOptionUser = (option, user) => {
    if (option === "editar") {
      setSelectedUser(user);
      setShowEditModal(true);
    }
    if (option === "eliminar") {
      if (confirm(`¿Seguro que querés eliminar a ${user.name}?`)) {
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
    return <p className="p-6">Cargando usuarios...</p>;
  }

  if (isEmpty) {
    return <p className="p-6">No hay usuarios registrados.</p>;
  }

  return (
    <div className="p-10 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen w-full">
      <BackButton />
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-10 border border-gray-200">
        <h1 className="text-4xl font-black mb-10 text-gray-900 border-b-2 pb-6 tracking-tight">
          Gestión de Usuarios
        </h1>

        {/* Botones de acciones */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <button
            className="px-7 py-2 bg-gradient-to-r from-green-700 to-green-800 text-white font-bold rounded-full shadow-lg hover:from-green-800 hover:to-green-900 transition border border-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center gap-2"
            onClick={goAddUser}
          >
            <UserPlus size={18} />
            + Agregar Usuario
          </button>
          <div className="flex-1">
            <SearchUser onSearch={search} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-lg">
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 uppercase text-base leading-normal border-b-2 border-gray-300">
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-6 font-semibold">Nombre</th>
                <th className="py-4 px-6 font-semibold">Rol</th>
                <th className="py-4 px-6 font-semibold">Contraseñas</th>
                <th className="py-4 px-6 font-semibold">Sitio</th>
                <th className="py-4 px-6 font-semibold">Zona</th>
                <th className="py-4 px-6 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(visibleUsers) &&
                visibleUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="text-center hover:bg-gray-50 transition border-b border-gray-200"
                  >
                    <td className="py-3 px-6">{user.id}</td>
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-xs border ${
                          user.rol === "admin"
                            ? "bg-red-100 text-red-900 border-red-200"
                            : "bg-green-100 text-green-900 border-green-200"
                        }`}
                      >
                        {user.rol}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200">
                        {user.password}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 font-semibold text-xs border border-indigo-200">
                          {user.site.latitude}
                        </span>
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 font-semibold text-xs border border-indigo-200">
                          {user.site.longitude}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-900 font-semibold text-xs border border-purple-200">
                        {user.zona.locality}
                      </span>
                    </td>
                    <td className="py-3 px-6 flex justify-center gap-2">
                        <button
                        className="px-4 py-1 text-xs bg-yellow-200 text-gray-800 rounded-full shadow hover:bg-yellow-300 transition font-bold border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 flex items-center gap-1"
                        onClick={() => handleOptionUser("editar", user)}
                        >
                        <Pencil size={16} />
                        Editar
                        </button>
                        <button
                        className="px-4 py-1 text-xs bg-red-300 text-black rounded-full shadow hover:bg-red-500 transition font-bold border border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 flex items-center gap-1"
                        onClick={() => handleOptionUser("eliminar", user)}
                        >
                        <Trash2 size={16} />
                        Eliminar
                        </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {showEditModal && (
          <FormEditUser
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setShowEditModal={setShowEditModal}
            saveUser={saveUser}
          />
        )}
      </div>
    </div>
  );
};

export default ViewManagementUsers;
