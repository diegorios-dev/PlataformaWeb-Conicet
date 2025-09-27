

const FormEditUser = ({selectedUser , setSelectedUser , setShowEditModal , saveUser}) => {
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
              
              <input 
                type="text" 
                className="border p-2 w-full mb-2"
                value={selectedUser?.name || ""}
                onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
              />
              <input 
                type="text" 
                className="border p-2 w-full mb-2"
                value={selectedUser?.rol || ""}
                onChange={(e) => setSelectedUser({...selectedUser, rol: e.target.value})}
              />

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowEditModal(false)} className="px-3 py-1 bg-gray-400 text-white rounded">
                  Cancelar
                </button>
                <button onClick={() => saveUser(selectedUser)} className="px-3 py-1 bg-blue-600 text-white rounded">
                  Guardar
                </button>
              </div>
            </div>
        </div>
    )
}

export default FormEditUser