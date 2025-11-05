import { useState, useEffect } from "react";
import { FileSpreadsheet, Download, AlertCircle, CheckCircle, Calendar, MapPin, User, Filter } from "lucide-react";
import BackButton from "../../BackButton";

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
  
  // Nuevos filtros
  const [zonaId, setZonaId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  
  // Datos para los selectores
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Cargar zonas, usuarios y años disponibles al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zonasRes, usuariosRes, yearsRes] = await Promise.all([
          fetch('http://localhost:8000/api/zonas'),
          fetch('http://localhost:8000/api/usuarios'),
          fetch('http://localhost:8000/api/reportes/available-years')
        ]);
        
        const zonasData = await zonasRes.json();
        const usuariosData = await usuariosRes.json();
        const yearsData = await yearsRes.json();
        
        // La API de zonas devuelve un array directo
        setZonas(Array.isArray(zonasData) ? zonasData : []);
        
        // La API de usuarios devuelve { users: [...] }
        setUsuarios(usuariosData.users || []);
        
        // La API de años devuelve { years: [2025, 2024, ...] }
        setAvailableYears(yearsData.years || []);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setZonas([]);
        setUsuarios([]);
        // Si falla, al menos mostrar el año actual
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
      // Construir la URL con parámetros opcionales
      let url = 'http://localhost:8000/api/download/reports';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (zonaId) params.append('zona_id', zonaId);
      if (userId) params.append('user_id', userId);
      if (year) params.append('year', year);
      if (month) params.append('month', month);
      if (day) params.append('day', day);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `reportes_diarios_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
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

  // Meses
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col">
      
      {/* Back Button flotante */}
      <div className="absolute top-6 left-6 z-50">
        <div className="backdrop-blur-xl transition-all duration-300">
          <BackButton />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          
          {/* Header */}
          <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-3xl shadow-2xl p-10 mb-8">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/40">
                <FileSpreadsheet className="w-10 h-10 text-green-700" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Exportar a Excel
              </h1>
            </div>
            <p className="text-center text-slate-600 text-base font-medium">
              Descarga los datos en formato Excel para análisis externo
            </p>
          </div>

          {/* Card principal */}
          <div className="backdrop-blur-2xl bg-white/40 border border-white/60 rounded-3xl shadow-2xl p-10">
            
            {/* Información */}
            <div className="mb-8 p-5 rounded-xl bg-blue-50/50 border border-blue-200/50">
              <p className="text-base text-slate-700">
                Aplica filtros para exportar reportes específicos o descarga todos los datos disponibles.
              </p>
            </div>

            {/* FILTROS */}
            <div className="mb-8 space-y-8">
              
              {/* Filtros por Rango de Fechas */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-700">Rango de Fechas</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Fecha inicial
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-5 py-3 text-base rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Fecha final
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-5 py-3 text-base rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Filtros por Año, Mes, Día */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-700">Filtros por Periodo</h3>
                  <span className="text-sm text-slate-500">(Independientes)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Año (todos los reportes del año)
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      disabled={loadingData}
                      className="w-full px-5 py-3 text-base rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all disabled:opacity-50"
                    >
                      <option value="">Todos los años</option>
                      {availableYears.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Mes (todos los reportes del mes)
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full px-5 py-3 text-base rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                    >
                      <option value="">Todos los meses</option>
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Día (todos los reportes del día)
                    </label>
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="w-full px-5 py-3 text-base rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                    >
                      <option value="">Todos los días</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mt-3">
                  💡 Estos filtros son independientes. Por ejemplo: seleccionar "Octubre" mostrará todos los reportes de octubre de cualquier año.
                </p>
              </div>

              {/* Filtro por Zona */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-700">Filtrar por Zona</h3>
                </div>
                
                <select
                  value={zonaId}
                  onChange={(e) => setZonaId(e.target.value)}
                  disabled={loadingData}
                  className="w-full px-5 py-3 text-base rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all disabled:opacity-50"
                >
                  <option value="">Todas las zonas</option>
                  {zonas.map((zona) => (
                    <option key={zona.id} value={zona.id}>
                      {zona.locality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Usuario */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-700">Filtrar por Usuario</h3>
                </div>
                
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={loadingData}
                  className="w-full px-5 py-3 text-base rounded-xl border border-slate-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all disabled:opacity-50"
                >
                  <option value="">Todos los usuarios</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón para limpiar filtros */}
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

            {/* Mensajes de estado */}
            {success && (
              <div className="mb-6 p-5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="text-base text-green-700 font-medium">
                  ¡Archivo descargado exitosamente!
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <p className="text-base text-red-700 font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Botón de descarga */}
            <button
              onClick={handleDownloadExcel}
              disabled={loading || loadingData}
              className="group relative overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-emerald-600/10 hover:from-green-500/20 hover:to-emerald-600/20 border border-green-300/40 hover:border-green-400/60 rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <div className="relative flex items-center justify-center gap-4">
                {loading ? (
                  <>
                    <div className="w-7 h-7 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xl font-bold text-green-900">Descargando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-7 h-7 text-green-700" />
                    <span className="text-xl font-bold text-green-900">Descargar Excel</span>
                  </>
                )}
              </div>
            </button>

            {/* Información adicional */}
            <div className="mt-8 p-5 rounded-xl bg-slate-50/50 border border-slate-200/50">
              <h3 className="text-base font-semibold text-slate-700 mb-3">Ejemplos de uso:</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• <strong>Año 2025 + Mes Octubre:</strong> Todos los reportes de octubre 2025</li>
                <li>• <strong>Mes Octubre:</strong> Todos los reportes de octubre (cualquier año)</li>
                <li>• <strong>Día 15:</strong> Todos los reportes del día 15 (cualquier mes/año)</li>
                <li>• <strong>Usuario + Zona:</strong> Reportes de un usuario específico en una zona</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}