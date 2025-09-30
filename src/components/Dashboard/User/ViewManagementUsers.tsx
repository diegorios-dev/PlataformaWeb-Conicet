import { useState } from "react";
import {getUsersByWord , saveUser} from "../../../services/userService";
import useUsers from "../../../hooks/useUsers";
import FormEditUser from "./FormEditUser"
import SearchUser from "./searchUser";
import useNavegation from "../../../hooks/useNavegation";

const ViewManagementUsers = () => {

  const { users, loading, handleSetUser, fetchUsers } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const {goAddUser, goBack} = useNavegation()

  const isLoading = loading;
  const isEmpty = !users || users.length === 0;

  const visibleUsers = users
  
  console.log(visibleUsers)

  const handleOptionUser = (option , user) => {
    if(option === "editar"){
      setSelectedUser(user);
      setShowEditModal(true);
    }
    if(option === "eliminar"){
      if(confirm(`¿Seguro que querés eliminar a ${user.name}?`)){
      }
    }

  }
    
    const search = async (word) => {
      try {
        if (!word || word.trim() === "") {
          // si no hay palabra -> traer todos
          await fetchUsers();
        } else {
          const data = await getUsersByWord(word);
          handleSetUser(data.users);
        }
      } catch (error) {
        console.error("Error al buscar usuarios:", error);
        alert("No se pudo buscar usuarios");
      }
    };

    if(isLoading){
      return <p className="p-6">Cargando usuarios...</p>;
    }

    if (isEmpty) {
      return <p className="p-6">No hay usuarios registrados.</p>;
    }


  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <button
          onClick={goBack}
          className="px-6 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-950 transition font-semibold text-base"
        >
          Volver
        </button>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-4">Gestión de Usuarios</h1>

        {/* Botones de acciones */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <button
            className="px-6 py-2 bg-green-700 text-white font-semibold rounded-lg shadow hover:bg-green-800 transition"
            onClick={goAddUser}
          >
            Agregar Usuario
          </button>
          <div className="flex-1">
            <SearchUser onSearch={search} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Nombre</th>
                <th className="py-3 px-4 border-b">Rol</th>
                <th className="py-3 px-4 border-b">Contraseñas</th>
                <th className="py-3 px-4 border-b">Sitio</th>
                <th className="py-3 px-4 border-b">Zona</th>
                <th className="py-3 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id} className="text-center hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.rol}</td>
                  <td className="py-2 px-4 border-b">{user.password}</td>
                  <td className="py-2 px-4 border-b">[{user.site.latitude}, {user.site.longitude}]</td>
                  <td className="py-2 px-4 border-b">{user.zona.locality}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
                      onClick={() => handleOptionUser("editar", user)}
                    >
                      Editar
                    </button>
                    <button
                      className="ml-2 px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                      onClick={() => handleOptionUser("eliminar", user)}
                    >
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
