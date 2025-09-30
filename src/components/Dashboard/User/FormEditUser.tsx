
import useNavegation from "../../../hooks/useNavegation"
const FormEditUser = ({selectedUser , setSelectedUser , setShowEditModal , saveUser}) => {
    const {goBack} = useNavegation();

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
        <div className="absolute top-8 left-8 z-10">
          <button
            onClick={goBack}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-950 transition font-semibold"
            title="Volver"
          >
            Volver
          </button>
        </div>
        <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">Editar Usuario</h2>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre"
              value={selectedUser?.name || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rol"
              value={selectedUser?.rol || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, rol: e.target.value })}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contraseña"
              value={selectedUser?.password || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Latitud"
              value={selectedUser?.site.latitude || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  site: {
                    ...selectedUser.site,
                    latitude: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Longitud"
              value={selectedUser?.site.longitude || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  site: {
                    ...selectedUser.site,
                    longitude: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Localidad"
              value={selectedUser?.zona.locality || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  zona: {
                    ...selectedUser.zona,
                    locality: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => saveUser(selectedUser)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )
}

export default FormEditUser