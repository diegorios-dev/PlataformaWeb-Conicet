// src/components/BaseMapSelector.tsx
import React from "react";
import { MapPin, Map, Satellite, Mountain } from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

interface Props {
  baseMap: string;
  setBaseMap: (b: string) => void;
  position?: "left" | "right";
  className?: string;
}

export const BaseMapSelector: React.FC<Props> = ({ 
  baseMap, 
  setBaseMap, 
  position = "left",
  className = "" 
}) => {
  const positionClasses = position === "left" ? "left-6" : "right-6";
  
  return (
    <div className={`absolute top-6 ${positionClasses} z-[999] w-60 ${className}`}>
      <div className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/30 shadow-xl">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3 tracking-wide uppercase">
          <MapPin className="w-4 h-4 text-blue-600" />
          Mapa Base
        </label>
        <CustomSelect
          options={[
            {
              value: "original",
              label: "Mapa Estándar",
              icon: <Map className="w-4 h-4" />,
            },
            {
              value: "vegetacion",
              label: "Satelital",
              icon: <Satellite className="w-4 h-4" />,
            },
            {
              value: "topografia",
              label: "Topografía + Ríos",
              icon: <Mountain className="w-4 h-4" />,
            },
          ]}
          value={baseMap}
          onChange={(value) => setBaseMap(String(value))}
          placeholder="Seleccione mapa base"
          icon={<MapPin className="w-5 h-5" />}
        />
      </div>
    </div>
  );
};
