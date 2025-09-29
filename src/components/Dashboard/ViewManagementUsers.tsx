import { useState } from "react";
import {getUsersByWord , saveUser} from "../../services/userService";
import useUsers from "../../hooks/useUsers";
import FormEditUser from "../Dashboard/FormEditUser"
import SearchUser from "../Dashboard/searchUser";

const ViewManagementUsers = () => {

  const { users, loading, handleSetUser, filteredUsers } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  
  const isLoading = loading;
  const isEmpty = !users || users.length === 0;
  const visibleUsers = filteredUsers.length > 0 ? filteredUsers : users

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
        const data = await getUsersByWord( word );
        console.log("Usuario buscado por palabra:", data.user);
        handleSetUser(data.user);
      } catch (error) {
        console.error("Error al validar usuario:", error);
        alert("Contraseña inválida");
      }
    };
        
    if(isLoading){
      return <p className="p-6">Cargando usuarios...</p>;
    }

    if (isEmpty) {
      return <p className="p-6">No hay usuarios registrados.</p>;
    }


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      {/* Botones de acciones */}
      <div className="flex gap-4 mb-6">

        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Agregar Usuario
        </button>

        <SearchUser onSearch={(search)}/>

      </div>

        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Rol</th>
              <th className="p-2 border">Contraseñas</th>
              <th className="p-2 border">Sitio</th>
              <th className="p-2 border">Zona</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            
            {visibleUsers.map((user) => (
              <tr key={user.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{user.id}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.rol}</td>
                <td className="p-2 border">{user.password}</td>
                <td className="p-2 border">[{user.site.latitude}, {user.site.longitude}]</td>
                <td className="p-2 border">{user.zona.locality}</td>
                <td className="p-2 border">
                  <button className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleOptionUser("editar",user)}
                  >
                    Editar
                  </button>

                  <button className="ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleOptionUser("eliminar",user)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

        {showEditModal && (
          <FormEditUser selectedUser={selectedUser} setSelectedUser={setSelectedUser} setShowEditModal={setShowEditModal} saveUser={saveUser}/>
        )}

        

    </div>
  );
};

export default ViewManagementUsers;
