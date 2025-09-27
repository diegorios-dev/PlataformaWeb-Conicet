import useUsers from "../hooks/useUsers";

const ViewManagementUsers = () => {
    
  const { users, loading } = useUsers();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      {/* Botones de acciones */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Modificar Usuario
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Agregar Usuario
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Borrar Usuario
        </button>
      </div>

      {/* Lista de usuarios */}
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : !users || users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Rol</th>
              <th className="p-2 border">Contraseñas</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.rol}</td>
                <td className="p-2 border">{u.password}</td>
                <td className="p-2 border">
                  <button className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Editar
                  </button>
                  <button className="ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewManagementUsers;
