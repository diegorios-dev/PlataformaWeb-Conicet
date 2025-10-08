

const ViewOptionMenu = (
    {optionMenu , handleSetOptionMenu , selectedInstrument , isLogin , goAdminUi}
) => {
    return (
        <div className="flex flex-col gap-4 p-6">
            {isLogin && (
                <button
                    onClick={goAdminUi}
                    className="w-full py-3 px-5 rounded-full font-semibold transition duration-200 shadow-sm border bg-blue-700 hover:shadow-md text-white border-blue-700 hover:bg-blue-800"
                >
                    Panel Admin
                </button>    )}

            {optionMenu.map((item, index) => (
                <button
                    key={index}
                    className={`w-full py-3 px-5 rounded-full font-semibold transition duration-200 shadow-sm border bg-gray-300
                        ${
                            selectedInstrument === item.precipitacion
                                ? "bg-gradient-to-r from-gray-100 to-gray-300 text-blue-700 border-blue-700 ring-2 ring-blue-300"
                                : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-blue-400"
                        }`}
                    onClick={() => handleSetOptionMenu(item.precipitacion)}
                >
                    <span className="text-lg">{item.instrumento}</span>
                </button>
            ))}
        </div>
    )
}

export default ViewOptionMenu