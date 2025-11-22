import { Beaker, Atom, Activity } from "lucide-react";

interface SampleChemical {
  ph?: number;
  conductivity?: number;
  Na?: number;
}

interface SampleIsotopo {
  δ2H?: number;
  '18O'?: number;
}

interface SampleLevel {
  nivel_freatico?: number;
}

interface ReportCardSamplesProps {
  sampleChemical?: SampleChemical;
  sampleIsotopo?: SampleIsotopo;
  sampleLevel?: SampleLevel;
}

export const ReportCardSamples = ({ sampleChemical, sampleIsotopo, sampleLevel }: ReportCardSamplesProps) => {
  return (
    <div className="space-y-3">
      {/* Grupo 1: Muestras Químicas */}
      {sampleChemical && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-cyan-100 p-2.5 rounded-xl shadow-sm">
              <Beaker className="w-5 h-5 text-cyan-700" />
            </div>
            <span className="text-base font-bold text-cyan-900">📊 Muestras Químicas</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sampleChemical.ph && (
              <div className="bg-white/80 rounded-xl p-3 border border-cyan-200">
                <span className="text-xs font-medium text-cyan-700 block mb-1">pH</span>
                <span className="text-lg font-bold text-cyan-900">{sampleChemical.ph}</span>
                <span className="text-xs text-cyan-600 block mt-0.5">Escala 0-14</span>
              </div>
            )}
            {sampleChemical.conductivity && (
              <div className="bg-white/80 rounded-xl p-3 border border-cyan-200">
                <span className="text-xs font-medium text-cyan-700 block mb-1">Conductividad</span>
                <span className="text-lg font-bold text-cyan-900">{sampleChemical.conductivity}</span>
                <span className="text-xs text-cyan-600 block mt-0.5">µS/cm</span>
              </div>
            )}
            {sampleChemical.Na && (
              <div className="bg-white/80 rounded-xl p-3 border border-cyan-200">
                <span className="text-xs font-medium text-cyan-700 block mb-1">Sodio (Na)</span>
                <span className="text-lg font-bold text-cyan-900">{sampleChemical.Na}</span>
                <span className="text-xs text-cyan-600 block mt-0.5">mg/l</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grupo 2: Isótopos */}
      {sampleIsotopo && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 p-2.5 rounded-xl shadow-sm">
              <Atom className="w-5 h-5 text-purple-700" />
            </div>
            <span className="text-base font-bold text-purple-900">🧪 Isótopos</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleIsotopo.δ2H && (
              <div className="bg-white/80 rounded-xl p-3 border border-purple-200">
                <span className="text-xs font-medium text-purple-700 block mb-1">δ2H (Deuterio)</span>
                <span className="text-lg font-bold text-purple-900">{sampleIsotopo.δ2H}</span>
                <span className="text-xs text-purple-600 block mt-0.5">‰ (Por mil)</span>
              </div>
            )}
            {sampleIsotopo['18O'] && (
              <div className="bg-white/80 rounded-xl p-3 border border-purple-200">
                <span className="text-xs font-medium text-purple-700 block mb-1">δ¹⁸O (Oxígeno-18)</span>
                <span className="text-lg font-bold text-purple-900">{sampleIsotopo['18O']}</span>
                <span className="text-xs text-purple-600 block mt-0.5">‰ (Por mil)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grupo 3: Hidrogeología */}
      {sampleLevel?.nivel_freatico && (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-teal-100 p-2.5 rounded-xl shadow-sm">
              <Activity className="w-5 h-5 text-teal-700" />
            </div>
            <span className="text-base font-bold text-teal-900">🌊 Hidrogeología</span>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-teal-200">
            <span className="text-xs font-medium text-teal-700 block mb-1">Nivel Freático</span>
            <span className="text-lg font-bold text-teal-900">{sampleLevel.nivel_freatico}</span>
            <span className="text-xs text-teal-600 block mt-0.5">m (Metros)</span>
          </div>
        </div>
      )}
    </div>
  );
};