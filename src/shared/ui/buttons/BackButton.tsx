
import { ArrowLeft } from "lucide-react";
import useNavigation from "../../../hooks/useNavegation";

const BackButton = () => {
  const { go } = useNavigation();

  return (

     <div className="mb-8 flex items-center gap-4 ">
        <button
          onClick={go.back}
          className="px-7 py-2 bg-blue-950 text-white rounded-full shadow-lg hover:bg-blue-900 transition font-bold text-base border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
      </div>
  );
};

export default BackButton;