
import { useNavigate } from "react-router-dom";

export default function ShowHistograma() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-12 gap-8 min-h-[70vh] bg-gray-50 rounded-xl shadow-lg p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center tracking-wide">
        Dashboard de Histogramas
      </h1>

      <div className="flex flex-col gap-6 w-full">
        <button
          className="bg-sky-400 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold text-lg shadow transition-all w-full"
          onClick={() => navigate("/histograma/lluvia")}
        >
          Ver histograma de lluvia
        </button>

        <button
          className="bg-sky-400 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold text-lg shadow transition-all w-full"
          onClick={() => navigate("/histograma/nieve")}
        >
          Ver histograma de nieve
        </button>

        <button
          className="bg-sky-400 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold text-lg shadow transition-all w-full"
          onClick={() => navigate("/histograma/caudalimetro")}
        >
          Ver histograma de caudalímetro
        </button>
      </div>
    </div>
  );
}