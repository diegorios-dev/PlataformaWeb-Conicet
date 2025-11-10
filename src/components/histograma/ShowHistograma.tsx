import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import { BarChart, CloudRain, CloudSnow, Waves } from "lucide-react";

export default function ShowHistograma() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <BackButton />

        {/* Header alineado con ShowReport */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <BarChart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Histogramas
              </h1>
              <p className="text-base text-slate-600 mt-1 font-medium">
                Visualización de precipitación y caudal por instrumento
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta principal con acciones */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/histograma/lluvia")}
              className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
            >
              <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-slate-800 font-semibold">Histograma de lluvia</span>
            </button>

            <button
              onClick={() => navigate("/histograma/nieve")}
              className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
            >
              <div className="bg-cyan-100 text-cyan-700 p-3 rounded-xl">
                <CloudSnow className="w-5 h-5" />
              </div>
              <span className="text-slate-800 font-semibold">Histograma de nieve</span>
            </button>

            <button
              onClick={() => navigate("/histograma/caudalimetro")}
              className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
            >
              <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl">
                <Waves className="w-5 h-5" />
              </div>
              <span className="text-slate-800 font-semibold">Histograma de caudalímetro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
