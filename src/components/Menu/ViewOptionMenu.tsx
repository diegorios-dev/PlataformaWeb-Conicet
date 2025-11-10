import { Droplet, Ruler } from "lucide-react";
import { memo } from "react";

const icons = {
  Lluvia: <Droplet className="w-6 h-6" />,
  Nieve: <Ruler className="w-6 h-6" />,
  Regla: <Ruler className="w-6 h-6" />,
};

// ⚡ Memorizar componente
const ViewOptionMenu = memo(({ instruments, selectedInstrument, onSelectInstrument }) => {
  return (
    <div className="flex flex-col gap-2 md:gap-2.5">
      {instruments.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelectInstrument(item.event)}
          className={`group relative flex items-center gap-2.5 md:gap-3 w-full px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 overflow-hidden
            ${
              selectedInstrument === item.event
                ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30 scale-[1.02]"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-yellow-300 hover:shadow-md active:scale-[0.98]"
            }`}
        >
          {selectedInstrument === item.event && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 animate-pulse" />
          )}
          <span className="relative z-10 flex items-center gap-2.5 md:gap-3">
            {icons[item.event]}
            {item.instrumento}
          </span>
        </button>
      ))}
    </div>
  );
});

ViewOptionMenu.displayName = 'ViewOptionMenu';

export default ViewOptionMenu;
