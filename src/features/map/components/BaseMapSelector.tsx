// src/components/BaseMapSelector.tsx
import React from "react";
import { MapPin } from "lucide-react";

interface Props {
  baseMap: string;
  setBaseMap: (b: string) => void;
}

export const BaseMapSelector: React.FC<Props> = ({ baseMap, setBaseMap }) => {
  return (
    <div className="absolute top-6 left-6 z-[999]">
      <div className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/30 shadow-xl">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3 tracking-wide uppercase">
          <MapPin className="w-4 h-4 text-blue-600" />
          Mapa Base
        </label>
        <select
          value={baseMap}
          onChange={(e) => setBaseMap(e.target.value)}
          className="text-sm bg-white/60 backdrop-blur-sm border-2 border-white/40 rounded-xl px-4 py-2.5 font-semibold text-slate-800 cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full [&>option]:bg-white [&>option]:text-slate-800 [&>option]:font-semibold [&>option]:py-2"
        >
          <option value="original">Mapa Estándar</option>
          <option value="vegetacion">Satelital</option>
          <option value="topografia">Topografía + Ríos</option>
        </select>
      </div>
    </div>
  );
};
