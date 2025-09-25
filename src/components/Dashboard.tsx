
const Dashboard = ({ setShowAdminUI }: any) => {
    return (
        <div className="flex-1 p-6 bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
            {/* Aquí va toda la UI que quieras para admin */}

            <button
                className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Ver usuario
            </button>


            <button
                className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Editar Reportes
            </button>

            <button
                className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Agregar usuarios
            </button>

            <button
                className="mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Agregar Instrumentos
            </button>

            <button
                onClick={() => setShowAdminUI(false)}
                className="mt-4 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
                Cerrar Panel Admin
            </button>

        </div>
    )
}

export default Dashboard;