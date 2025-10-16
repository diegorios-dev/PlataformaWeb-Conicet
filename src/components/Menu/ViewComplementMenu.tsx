import { BarChart3, Map as MapIcon } from "lucide-react";

const icons = {
  "Ver Histograma": <BarChart3 className="w-6 h-6" />,
  "Ver Mapa de Calor": <MapIcon className="w-6 h-6" />,
};

const ViewComplementMenu = ({ complements }) => {
  return (
    <div className="flex flex-col gap-3">
      {complements.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="flex items-center gap-4 w-full px-6 py-4 rounded-lg text-lg font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
        >
          {icons[item.option]}
          {item.option}
        </button>
      ))}
    </div>
  );
};

export default ViewComplementMenu;
