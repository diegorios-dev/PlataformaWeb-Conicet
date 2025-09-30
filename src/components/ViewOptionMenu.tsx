

const ViewOptionMenu = (
    {optionMenu , handleSetOptionMenu , selectedInstrument , isLogin , goAdminUi}
) => {
    return (
        <div>
            {isLogin && (
                <button onClick={goAdminUi} className="w-full mt-4 p-2 rounded-lg bg-purple-600 hover:bg-purple-700">
                    Panel Admin
                </button>
            )}

            {optionMenu.map((item, index) => (
            <button key={index} className={`w-full p-2 rounded-lg transition ${selectedInstrument === item.precipitacion ? "bg-blue-600" : "hover:bg-blue-700"}`}
                onClick={() => handleSetOptionMenu(item.precipitacion)}
            >
                {item.instrumento}
            </button>
            ))}
        </div>

    )
}

export default ViewOptionMenu