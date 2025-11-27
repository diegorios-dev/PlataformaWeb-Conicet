import { useState, useEffect } from "react";

import {
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  User as UserIcon,
  Filter,
  Loader2,
  Lightbulb,
  CalendarDays
} from "lucide-react";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

import { API_URL } from "@config/api";
import type { Zona, Usuario } from "../types/interfaces";
import { DashboardLayout } from "@/shared/ui/layouts/DashboardLayout";


export default function ExportExcel() {
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros de fecha
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Filtros adicionales
  const [zonaId, setZonaId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");

  // Datos para selectores
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zonasRes, usuariosRes, yearsRes] = await Promise.all([
          fetch(`${API_URL}/zonas`),
          fetch(`${API_URL}/usuarios`),
          fetch(`${API_URL}/reportes/available-years`),
        ]);

        const zonasData = await zonasRes.json();
        const usuariosData = await usuariosRes.json();
        const yearsData = await yearsRes.json();

        setZonas(Array.isArray(zonasData) ? zonasData : []);
        setUsuarios(usuariosData.users || []);
        setAvailableYears(yearsData.years || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setZonas([]);
        setUsuarios([]);
        setAvailableYears([new Date().getFullYear()]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadExcel = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let url = `${API_URL}/download/reports`;
      const params = new URLSearchParams();

      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      if (zonaId) params.append("zona_id", zonaId);
      if (userId) params.append("user_id", userId);
      if (year) params.append("year", year);
      if (month) params.append("month", month);
      if (day) params.append("day", day);

      if (params.toString()) url += "?" + params.toString();

      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error("Error al descargar el archivo");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `reportes_diarios_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setZonaId("");
    setUserId("");
    setYear("");
    setMonth("");
    setDay("");
  };

  const hasFilters = startDate || endDate || zonaId || userId || year || month || day;

  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  return (
    <DashboardLayout contentClassName="">
      <div className="w-full max-w-7xl mx-auto">

        {/* Header estilo ShowReport */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Exportación a Excel
              </h1>
              <p className="text-base text-slate-600 mt-1 font-medium">
                Descargá reportes aplicando filtros opcionales
              </p>
            </div>
          </div>
        </div>

        {/* Card principal estilo ShowReport */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8">
          {/* Info */}
          <div className="mb-8 p-5 rounded-2xl bg-blue-50/70 border-2 border-blue-200/70">
            <p className="text-slate-700">
              Seleccioná filtros para descargar un subconjunto de reportes o dejá todo vacío para descargar todo.
            </p>
          </div>

          {/* Filtros */}
          <div className="space-y-8">
            {/* Rango de fechas */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-700">Rango de fechas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha inicial</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha final</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Por período */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-700">Filtros por período</h3>
                <span className="text-sm text-slate-500">(independientes)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Año</label>
                  <CustomSelect
                    options={[
                      { value: "", label: "Todos los años", icon: <Calendar className="w-4 h-4" /> },
                      ...availableYears.map((y) => ({
                        value: y.toString(),
                        label: y.toString(),
                        icon: <Calendar className="w-4 h-4" />
                      }))
                    ]}
                    value={year}
                    onChange={(value) => setYear(String(value))}
                    placeholder="Seleccione un año"
                    icon={<Calendar className="w-5 h-5" />}
                    disabled={loadingData}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mes</label>
                  <CustomSelect
                    options={[
                      { value: "", label: "Todos los meses", icon: <CalendarDays className="w-4 h-4" /> },
                      ...months.map((m) => ({
                        value: m.value,
                        label: m.label,
                        icon: <CalendarDays className="w-4 h-4" />
                      }))
                    ]}
                    value={month}
                    onChange={(value) => setMonth(String(value))}
                    placeholder="Seleccione un mes"
                    icon={<CalendarDays className="w-5 h-5" />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Día</label>
                  <CustomSelect
                    options={[
                      { value: "", label: "Todos los días", icon: <Calendar className="w-4 h-4" /> },
                      ...Array.from({ length: 31 }, (_, i) => i + 1).map((d) => ({
                        value: d.toString(),
                        label: d.toString(),
                        icon: <Calendar className="w-4 h-4" />
                      }))
                    ]}
                    value={day}
                    onChange={(value) => setDay(String(value))}
                    placeholder="Seleccione un día"
                    icon={<Calendar className="w-5 h-5" />}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                <Lightbulb className="inline w-4 h-4 mr-1 text-yellow-400" />
                Por ejemplo: elegir solo "Octubre" descarga todos los reportes de octubre de cualquier año.
              </p>
            </div>

            {/* Zona */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-700">Filtrar por zona</h3>
              </div>
              <CustomSelect
                options={[
                  { value: "", label: "Todas las zonas", icon: <MapPin className="w-4 h-4" /> },
                  ...zonas.map((z) => ({
                    value: z.id.toString(),
                    label: z.locality,
                    icon: <MapPin className="w-4 h-4" />
                  }))
                ]}
                value={zonaId}
                onChange={(value) => setZonaId(String(value))}
                placeholder="Seleccione una zona"
                icon={<MapPin className="w-5 h-5" />}
                disabled={loadingData}
              />
            </div>

            {/* Usuario */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <UserIcon className="w-6 h-6 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-700">Filtrar por usuario</h3>
              </div>
              <CustomSelect
                options={[
                  { value: "", label: "Todos los usuarios", icon: <UserIcon className="w-4 h-4" /> },
                  ...usuarios.map((u) => ({
                    value: u.id.toString(),
                    label: u.name,
                    icon: <UserIcon className="w-4 h-4" />
                  }))
                ]}
                value={userId}
                onChange={(value) => setUserId(String(value))}
                placeholder="Seleccione un usuario"
                icon={<UserIcon className="w-5 h-5" />}
                disabled={loadingData}
              />
            </div>

            {/* Limpiar filtros */}
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 underline transition-colors"
              >
                <Filter className="w-4 h-4" />
                Limpiar todos los filtros
              </button>
            )}
          </div>

          {/* Estados */}
          <div className="mt-8 space-y-4">
            {success && (
              <div className="p-5 rounded-2xl bg-green-50 border-2 border-green-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <p className="text-green-700 font-medium">¡Archivo descargado exitosamente!</p>
              </div>
            )}
            {error && (
              <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                <div className="text-red-700">{error}</div>
              </div>
            )}
          </div>

          {/* Botón descargar */}
          <button
            onClick={handleDownloadExcel}
            disabled={loading || loadingData}
            className={`mt-6 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${
              loading || loadingData
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/30 hover:shadow-xl"
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-6 h-6" />}
            {loading ? "Preparando archivo..." : "Descargar Excel"}
          </button>

          {/* Ayuda */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-blue-900">Ejemplos de Uso</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                <span className="font-bold text-blue-600 text-sm">•</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Reportes de octubre 2025</p>
                  <p className="text-xs text-slate-600">Seleccioná: Año → 2025 | Mes → Octubre</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                <span className="font-bold text-blue-600 text-sm">•</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Todos los octubres</p>
                  <p className="text-xs text-slate-600">Seleccioná solo: Mes → Octubre (sin año)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                <span className="font-bold text-blue-600 text-sm">•</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Todos los días 15</p>
                  <p className="text-xs text-slate-600">Seleccioná solo: Día → 15 (sin mes ni año)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                <span className="font-bold text-blue-600 text-sm">•</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Reportes de un usuario en una zona</p>
                  <p className="text-xs text-slate-600">Seleccioná: Usuario → Juan Pérez | Zona → Centro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}