

const ViewOptionMenu = (
    {optionMenu , handleSetOptionMenu , selectedInstrument , isLogin , goAdminUi}
) => {
    return (
        <div className="flex flex-col gap-3">
            {isLogin && (
                <button
                    onClick={goAdminUi}
                    className="w-full mt-2 py-2 px-4 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition duration-200"
                >
                    Panel Admin
                </button>
            )}

            {optionMenu.map((item, index) => (
                <button
                    key={index}
                    className={`w-full py-2 px-4 rounded border font-medium transition duration-200
                        ${selectedInstrument === item.precipitacion
                            ? "bg-gray-200  text-gray-900"
                            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                        }`}
                    onClick={() => handleSetOptionMenu(item.precipitacion)}
                >
                    {item.instrumento}
                </button>
            ))}
        </div>

    )
}

export default ViewOptionMenu