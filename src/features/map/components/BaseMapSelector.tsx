// src/components/BaseMapSelector.tsx
import React from "react";
import { MapPin, Map, Satellite, Mountain } from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

interface Props {
  baseMap: string;
  setBaseMap: (b: string) => void;
  positionClasses?: string;
  className?: string;
}

export const BaseMapSelector: React.FC<Props> = ({ 
  baseMap, 
  setBaseMap, 
  positionClasses,
  className = "" 
}) => {
  
  return (
    <div className={`absolute ${positionClasses} z-[999] w-60 ${className}`}>
      <div className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/30 shadow-xl">
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
          onChange={(value) => setBaseMap(value as string)}
          placeholder="Seleccione mapa base"
          icon={<MapPin className="w-5 h-5" />}
        />
      </div>
    </div>
  );
};
