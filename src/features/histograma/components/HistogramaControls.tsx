import { FileText, Gauge, Calendar } from "lucide-react";
import { months } from "../contants/constants";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

export default function HistogramaControls({
  periodo,
  setPeriodo,
  month,
  setMonth,
  year,
  setYear,
  pdfQuality,
  setPdfQuality,
  generandoPDF,
  loading,
  data,
  onGeneratePDF
}) {
  return (
    <div className="relative z-50 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8 mb-6">
      {/* Config */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <span className="text-base font-semibold text-slate-800">Configuración</span>

        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-600">Calidad:</label>

          <div className="w-32">
            <CustomSelect
              options={[
                { value: "1", label: "Baja", icon: <Gauge className="w-4 h-4" /> },
                { value: "2", label: "Media", icon: <Gauge className="w-4 h-4" /> },
                { value: "3", label: "Alta", icon: <Gauge className="w-4 h-4" /> }
              ]}
              value={String(pdfQuality)}
              onChange={(value) => setPdfQuality(Number(value))}
              icon={<Gauge className="w-5 h-5" />}
              disabled={generandoPDF}
            />
          </div>

          {/* Botón PDF */}
          <button
            onClick={onGeneratePDF}
            disabled={!data || loading || generandoPDF}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <FileText size={18} />
            {generandoPDF ? "Generando..." : "Generar PDF"}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Tipo */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">Agrupar por</label>
          <div className="bg-slate-100/70 border border-slate-200 rounded-full p-1 flex">
            {[
              { key: "dia", label: "Día" },
              { key: "mes", label: "Mes" },
              { key: "año", label: "Año" },
            ].map((btn) => {
              const active = periodo === btn.key;
              return (
                <button
                  key={btn.key}
                  onClick={() => setPeriodo(btn.key)}
                  className={`flex-1 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-800 hover:bg-white/60"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {periodo === "dia" && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600">Mes</label>
            <CustomSelect
              options={months.map((m) => ({
                value: String(m.value),
                label: m.label,
                icon: <Calendar className="w-4 h-4" />
              }))}
              value={String(month)}
              onChange={(value) => setMonth(Number(value))}
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>
        )}

        {(periodo === "dia" || periodo === "mes") && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600">Año</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full pl-4 pr-3 py-2.5 bg-white/70 border border-slate-200 rounded-xl"
              min={2000}
              max={2100}
            />
          </div>
        )}
      </div>
    </div>
  );
}
