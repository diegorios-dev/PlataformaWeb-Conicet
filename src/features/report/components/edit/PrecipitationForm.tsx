import { Droplets, FileText } from "lucide-react";
import DynamicsSelection from "./DynamicOptionsSelector";
import LabelZone from "./ZoneLabel";
import LabelCoords from "./CoordinatesLabel";
import SummaryChange from "./ChangeSummary";

export const PrecipitacionForm = ({
  report,
  formData,
  handleChange,
  sitios,
  zonaSeleccionada,
  sitioSeleccionado
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
        <Droplets className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-800">Datos de Precipitación</h3>
      </div>

      {/* Nota */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <FileText size={18} className="text-slate-500" />
          Nota
        </label>

        <textarea
          name="note"
          rows="3"
          value={formData.note}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cantidad */}
      {report.report_regular && (
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Droplets size={18} className="text-slate-500" />
            Cantidad de precipitación
          </label>

          <div className="relative">
            <input
              type="number"
              step="0.1"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium">
              {report.report_regular.united_measure.abbreviation}
            </span>
          </div>
        </div>
      )}

      <DynamicsSelection formData={formData} handleChange={handleChange} sitios={sitios} />

      <LabelZone zonaSeleccionada={zonaSeleccionada} />

      <LabelCoords sitioSeleccionado={sitioSeleccionado} />

      <SummaryChange formData={formData} report={report} />
    </div>
  );
};
