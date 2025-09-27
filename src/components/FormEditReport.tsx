
const FormEditReport = ({setCurrentView}) => {
    return (
        <div>
          <h3 className="text-lg font-bold">Editar Reporte</h3>
          <button
            onClick={() => setCurrentView("reportes")}
            className="mt-4 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Volver a Reportes
          </button>
        </div>
    )
}

export default FormEditReport