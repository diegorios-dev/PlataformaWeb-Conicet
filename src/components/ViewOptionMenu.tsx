

const ViewOptionMenu = ({optionMenu , setSelectedInstrument , selectedInstrument}) => {
    return (
        <div>
            {optionMenu.map((item, index) => (
            <button
                key={index}
                className={`w-full p-2 rounded-lg transition ${
                selectedInstrument === item.precipitacion
                    ? "bg-blue-600"
                    : "hover:bg-blue-700"
                }`}
                onClick={() => setSelectedInstrument(item.precipitacion)}
            >
                Ver {item.instrumento}
            </button>
            ))}
        </div>

    )
}

export default ViewOptionMenu