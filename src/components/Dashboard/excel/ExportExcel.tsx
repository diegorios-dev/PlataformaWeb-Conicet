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
} from "lucide-react";
import BackButton from "../../BackButton";
import { API_URL } from "../../../config/api";
import IconNavMenu from "../../Menu/IconNavMenu";

interface Zona {
  id: number;
  locality: string;
}

interface Usuario {
  id: number;
  name: string;
}

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      <IconNavMenu />
      <div className="w-full max-w-7xl mx-auto">
        <BackButton />

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
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={loadingData}
                    className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                  >
                    <option value="">Todos</option>
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mes</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">Todos</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Día</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">Todos</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                💡 Por ejemplo: elegir solo "Octubre" descarga todos los reportes de octubre de cualquier año.
              </p>
            </div>

            {/* Zona */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-700">Filtrar por zona</h3>
              </div>
              <select
                value={zonaId}
                onChange={(e) => setZonaId(e.target.value)}
                disabled={loadingData}
                className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
              >
                <option value="">Todas</option>
                {zonas.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.locality}
                  </option>
                ))}
              </select>
            </div>

            {/* Usuario */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <UserIcon className="w-6 h-6 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-700">Filtrar por usuario</h3>
              </div>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={loadingData}
                className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
              >
                <option value="">Todos</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
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
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
            <h3 className="text-base font-semibold text-blue-900 mb-2">Ejemplos de uso</h3>
            <ul className="list-disc ml-5 text-sm text-blue-800 space-y-1">
              <li>Año 2025 + Mes Octubre: todos los reportes de octubre 2025</li>
              <li>Mes Octubre: todos los reportes de octubre (cualquier año)</li>
              <li>Día 15: todos los reportes del día 15 (cualquier mes/año)</li>
              <li>Usuario + Zona: reportes de un usuario específico en una zona</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}