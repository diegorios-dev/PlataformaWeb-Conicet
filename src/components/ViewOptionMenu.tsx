

const ViewOptionMenu = ({ instruments, selectedInstrument, onSelectInstrument }) => {
  return (
    <div className="flex flex-col gap-4 p-6">
      {instruments.map((item, index) => (
        <button
          key={index}
          className={`w-full py-3 px-5 rounded-full font-semibold transition duration-200 shadow-sm border 
            ${
              selectedInstrument === item.precipitacion
                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-700 ring-2 ring-blue-300"
                : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-blue-400"
            }`}
          onClick={() => onSelectInstrument(item.precipitacion)}
        >
          <span className="text-lg">{item.instrumento}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewOptionMenu;
