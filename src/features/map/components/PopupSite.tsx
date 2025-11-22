// src/components/PopupSite.tsx
import React from "react";
import { MapPin, Droplet, CalendarDays, AlertTriangle } from "lucide-react";
import type { SiteData, SiteStatus, Coord } from "../types/interfaces";

interface Props {
  site: Coord;
  reports?: SiteData | null;
  status?: SiteStatus | null;
  selectedYear?: number | null;
}

const PopupSite: React.FC<Props> = ({ site, reports, status, selectedYear }) => {
  const yearLabel = selectedYear ? selectedYear.toString() : "Todos los años";
  const lastReportDate = reports?.lastReportDate;
  
  const formattedDate = lastReportDate 
    ? new Date(lastReportDate).toLocaleDateString('es-AR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : yearLabel;
  
  const reportYear = lastReportDate 
    ? new Date(lastReportDate).getFullYear()
    : (selectedYear || 'N/A');

  return (
    <div className="font-sans p-3 min-w-[260px] bg-white rounded-xl">
      {/* Header del popup */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
        <div className="bg-blue-100 p-2 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <span className="text-base font-bold text-slate-800 block">
            {site.nombreSitio || 'Sitio'}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {site.coordenadas[0].toFixed(4)}, {site.coordenadas[1].toFixed(4)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-3">
        {/* Total acumulado */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Droplet className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Total Acumulado
            </span>
          </div>
          <span className="text-2xl font-bold text-blue-700 block">
            {reports?.totalAmount?.toFixed(2) || '0.00'} <span className="text-sm font-medium">mm</span>
          </span>
        </div>

        {/* Último reporte */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Último Reporte
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-800">
                {reports?.lastReportAmount?.toFixed(2) || '0.00'} <span className="text-xs font-medium text-slate-500">mm</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Año */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">Año de registro:</span>
          <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
            {reportYear}
          </span>
        </div>

        {/* Instrumentos averiados */}
        {status && !status.status && status.instrumentos_averiados.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                Instrumentos Averiados
              </span>
            </div>
            <div className="space-y-2">
              {status.instrumentos_averiados.map((inst, idx) => (
                <div key={idx} className="bg-white rounded p-2 border border-red-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{inst.instrument_name}</span>
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded">
                      {inst.cantidad_reportes_rotura} reporte{inst.cantidad_reportes_rotura > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">{inst.description}</p>
                  <p className="text-xs text-slate-500">
                    Última rotura: {new Date(inst.last_breakage_date).toLocaleDateString('es-AR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupSite;
