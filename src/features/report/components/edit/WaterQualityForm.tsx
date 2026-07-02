import { CustomSelect } from "@shared/ui/molecules/CustomSelect";
import { Droplets, Beaker, Activity } from "lucide-react";

interface WaterQualityGroup1 {
  ph: string;
  conductividad: string;
  na: string;
}

interface WaterQualityGroup2 {
  delta_2h: string;
  delta_18o: string;
}

interface WaterQualityGroup3 {
  nivel_freatico: string;
}

interface WaterQualityFormProps {
  grupoSeleccionado: string;
  setGrupoSeleccionado: (value: string) => void;
  grupo1Data: WaterQualityGroup1;
  setGrupo1Data: (value: WaterQualityGroup1) => void;
  grupo2Data: WaterQualityGroup2;
  setGrupo2Data: (value: WaterQualityGroup2) => void;
  grupo3Data: WaterQualityGroup3;
  setGrupo3Data: (value: WaterQualityGroup3) => void;
}

// Componente INPUT reutilizable
const InputField = ({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700 mb-1 block">{label}</label>
    <input
      type="number"
      step="0.01"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500"
      placeholder={placeholder}
    />
  </div>
);


export const CalidadAguaForm = ({
  grupoSeleccionado,
  setGrupoSeleccionado,
  grupo1Data,
  setGrupo1Data,
  grupo2Data,
  setGrupo2Data,
  grupo3Data,
  setGrupo3Data,
  }: WaterQualityFormProps) => {
  const resetAll = () => {
    setGrupo1Data({ ph: "", conductividad: "", na: "" });
    setGrupo2Data({ delta_2h: "", delta_18o: "" });
    setGrupo3Data({ nivel_freatico: "" });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
        <span className="w-6 h-6"><Droplets/></span>
        <h3 className="text-lg font-bold text-slate-800"> Parámetros de Calidad del Agua</h3>
      </div>

      {/* Select del grupo */}
      <div className="bg-gradient-to-r  rounded-xl p-4">
        <label className="flex items-center gap-2 text-sm font-bold  mb-3">
          Seleccione el Grupo de Parámetros
        </label>

        <CustomSelect
          options={[
            { 
              value: "", 
              label: "Seleccione un grupo",
              icon: <Droplets className="w-4 h-4" />
            },
            { 
              value: "grupo1", 
              label: "Muestras Químicas",
              subtitle: "pH, Conductividad, Na",
              icon: <Beaker className="w-4 h-4" />
            },
            { 
              value: "grupo2", 
              label: "Isótopos",
              subtitle: "δ2H, δ¹⁸O",
              icon: <Activity className="w-4 h-4" />
            },
            { 
              value: "grupo3", 
              label: "Hidrogeología",
              subtitle: "Nivel Freático",
              icon: <Droplets className="w-4 h-4" />
            }
          ]}
          value={grupoSeleccionado}
          onChange={(value) => {
            setGrupoSeleccionado(value as string);
            resetAll();
          }}
          placeholder="-- Seleccione un grupo --"
          icon={<Droplets className="w-5 h-5" />}
        />
      </div>

      {/* ------------------------------- */}
      {/* GRUPO 1 */}
      {/* ------------------------------- */}
      {grupoSeleccionado === "grupo1" && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <h4 className="font-bold text-slate-800 text-base mb-3">Grupo 1: Parámetros Químicos</h4>

          <InputField
            label="pH"
            value={grupo1Data.ph}
            placeholder="Ej: 7.2"
            onChange={(v) => setGrupo1Data({ ...grupo1Data, ph: v })}
          />

          <InputField
            label="Conductividad (µS/cm)"
            value={grupo1Data.conductividad}
            placeholder="Ej: 250.5"
            onChange={(v) => setGrupo1Data({ ...grupo1Data, conductividad: v })}
          />

          <InputField
            label="Na (mg/l)"
            value={grupo1Data.na}
            placeholder="Ej: 15.3"
            onChange={(v) => setGrupo1Data({ ...grupo1Data, na: v })}
          />
        </div>
      )}

      {/* ------------------------------- */}
      {/* GRUPO 2 */}
      {/* ------------------------------- */}
      {grupoSeleccionado === "grupo2" && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <h4 className="font-bold text-slate-800 text-base mb-3">Grupo 2: Isótopos</h4>

          <InputField
            label="δ2H (‰)"
            value={grupo2Data.delta_2h}
            placeholder="Ej: -45.2"
            onChange={(v) => setGrupo2Data({ ...grupo2Data, delta_2h: v })}
          />

          <InputField
            label="δ¹⁸O (‰)"
            value={grupo2Data.delta_18o}
            placeholder="Ej: -7.5"
            onChange={(v) => setGrupo2Data({ ...grupo2Data, delta_18o: v })}
          />
        </div>
      )}

      {/* ------------------------------- */}
      {/* GRUPO 3 */}
      {/* ------------------------------- */}
      {grupoSeleccionado === "grupo3" && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <h4 className="font-bold text-slate-800 text-base mb-3">Hidrogeología</h4>

          <InputField
            label="Nivel Freático (m)"
            value={grupo3Data.nivel_freatico}
            placeholder="Ej: 3.5"
            onChange={(v) => setGrupo3Data({ ...grupo3Data, nivel_freatico: v })}
          />
        </div>
      )}
    </div>
  );
};
