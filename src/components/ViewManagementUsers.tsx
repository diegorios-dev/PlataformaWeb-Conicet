import { useState } from "react";
import useUsers from "../hooks/useUsers";
import FormEditUser from "../components/FormEditUser"

const ViewManagementUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const saveUser = async (user) => {
    try {
      const payload = {
        name: user.name,
        rol: user.rol,
        password: user.password,
        latitude: user.site?.latitude,   // 👈 flatten
        longitude: user.site?.longitude, // 👈 flatten
        locality: user.zona?.locality,   // si necesitás zona
      };

      const res = await fetch(`http://localhost:8000/api/usuario/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // 👈 mandás el objeto plano
      });

      if (!res.ok) throw new Error("Error al actualizar usuario");

      const data = await res.json();
      console.log("Usuario actualizado:", data);

      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const { users, loading } = useUsers();

  const isLoading = loading;
  const isEmpty = !users || users.length === 0;


  if(isLoading){
    return <p className="p-6">Cargando usuarios...</p>;
  }

  if (isEmpty) {
    return <p className="p-6">No hay usuarios registrados.</p>;
  }

  const handleUser = (option , user) => {
    if(option === "editar"){
      setSelectedUser(user);
      setShowEditModal(true);
    }

    if(option === "eliminar"){
        if(confirm(`¿Seguro que querés eliminar a ${user.name}?`)){
        }
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      {/* Botones de acciones */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"

        >
          Agregar Usuario
        </button>
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
            {users.map((user) => (
              <tr key={user.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{user.id}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.rol}</td>
                <td className="p-2 border">{user.password}</td>
                <td className="p-2 border">[{user.site.latitude}, {user.site.longitude}]</td>
                <td className="p-2 border">{user.zona.locality}</td>
                <td className="p-2 border">
                  <button className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleUser("editar",user)}
                  >
                    Editar
                  </button>
                  
                  <button className="ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleUser("eliminar",user)}
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
