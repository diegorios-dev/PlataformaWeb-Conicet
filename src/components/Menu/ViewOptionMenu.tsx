import { Droplet, Ruler } from "lucide-react";

const icons = {
  Lluvia: <Droplet className="w-6 h-6" />,
  Nieve: <Ruler className="w-6 h-6" />,
};

const ViewOptionMenu = ({ instruments, selectedInstrument, onSelectInstrument }) => {
  return (
    <div className="flex flex-col gap-3">
      {instruments.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelectInstrument(item.event)}
          className={`flex items-center gap-4 w-full px-6 py-4 rounded-lg text-lg font-bold transition-all duration-200 
            ${
              selectedInstrument === item.event
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200"
            }`}
        >
          {icons[item.event]}
          {item.instrumento}
        </button>
      ))}
    </div>
  );
};

export default ViewOptionMenu;
