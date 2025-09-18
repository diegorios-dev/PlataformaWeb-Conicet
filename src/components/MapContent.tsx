import { useState } from "react";
import Map from "./map"; // tu componente de mapa

type Tool = "pluviometro" | "regla" | "caudalimetro";

const Dashboard = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<Tool>("pluviometro");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Herramientas</h2>

        <button
          className={`w-full p-2 rounded-lg transition ${
            selectedInstrument === "pluviometro" ? "bg-blue-600" : "hover:bg-blue-700"}`}
            onClick={() => setSelectedInstrument("pluviometro")}
        >
          Ver Pluviómetros
        </button>

        <button
          className={`w-full p-2 rounded-lg transition ${
            selectedInstrument === "regla" ? "bg-blue-600" : "hover:bg-blue-700"}`}
          onClick={() => setSelectedInstrument("regla")}
        >
          Ver Regla
        </button>

        <button
          className={`w-full p-2 rounded-lg transition ${
            selectedInstrument === "caudalimetro" ? "bg-blue-600" : "hover:bg-blue-700"}`}
          onClick={() => setSelectedInstrument("caudalimetro")}
        >
          Ver Caudalímetros
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <Map instrument={selectedInstrument} />
      </div>
    </div>

    
  );
};

export default Dashboard;
