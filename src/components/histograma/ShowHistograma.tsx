import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import { BarChart, CloudRain, CloudSnow, Waves } from "lucide-react";

export default function ShowHistograma() {
  const navigate = useNavigate();

  return (
    <>
      <div className="p-10">
        <BackButton />
      </div>
      <div className="flex flex-col items-center mt-12 gap-8 min-h-[50vh] bg-gray-100 rounded-xl shadow-xl p-10 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart className="w-8 h-8 text-gray-800" />
          <h1 className="text-3xl font-bold text-gray-800 text-center tracking-wide">
            Dashboard de Histogramas
          </h1>
        </div>

        <div className="flex flex-col gap-6 w-full">
            <button
            className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-gray-800 p-3 rounded-full font-semibold text-lg shadow transition-all w-full "
            onClick={() => navigate("/histograma/lluvia")}
            >
            <CloudRain className="w-6 h-6 justify-start text-black" />
            Ver histograma de lluvia
            </button>

            <button
            className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-gray-800 p-3 rounded-full font-semibold text-lg shadow transition-all w-full"
            onClick={() => navigate("/histograma/nieve")}
            >
            <CloudSnow className="w-6 h-6 justify-start text-black" />
            Ver histograma de nieve
            </button>

            <button
            className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-gray-800 p-3 rounded-full font-semibold text-lg shadow transition-all w-full "
            onClick={() => navigate("/histograma/caudalimetro")}
            >
            <Waves className="w-6 h-6 justify-start text-black" />
            Ver histograma de caudalímetro
            </button>
        </div>
      </div>
    </>
  );
}