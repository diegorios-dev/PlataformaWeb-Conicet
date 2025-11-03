import { useEffect, useState } from "react";
import { updateReporte } from "../../../services/reportService";
import { getAllSitios } from "../../../services/sitiosService";
import { getAllZonas } from "../../../services/zonaService";
import { useUserContext } from "../../../context/UserContext";
import useNavegation from "../../../hooks/useNavegation";
import {
  Save,
  X,
  FileText,
  MapPin,
  Droplets,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Edit3,
  Snowflake,
  Droplet,
  Locate
} from "lucide-react";
import BackButton from "../../BackButton";

const FormEditReport = () => {
  const { report } = useUserContext();
  const { goReports } = useNavegation();

  const [formData, setFormData] = useState({
    note: report.note || "",
    amount: report.report_regular?.amount || "",
    site_id: report.site?.id || "",
    zona_id: report.site?.zona_id || "",
  });

  
  // Selector de grupo (solo uno activo a la vez)
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
  
  // Grupo 1: pH, Conductividad, Na
  const [grupo1Data, setGrupo1Data] = useState({
    ph: "",
    conductividad: "",
    na: "",
  });
  
  // Grupo 2: δ2H, δ¹⁸O
  const [grupo2Data, setGrupo2Data] = useState({
    delta_2h: "",
    delta_18o: "",
  });
  
  // Grupo 3: Nivel Freático
  const [grupo3Data, setGrupo3Data] = useState({
    nivel_freatico: "",
  });

  const [sitios, setSitios] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [sitioSeleccionado, setSitioSeleccionado] = useState(null);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Cargar sitios y zonas al montar el componente
  useEffect(() => {
    fetchSitios();
    fetchZonas();
  }, []);

  // Establecer el sitio y zona iniciales
  useEffect(() => {
    if (sitios.length > 0 && report.site?.id) {
      const sitioActual = sitios.find(s => s.id === report.site.id);
      if (sitioActual) {
        setSitioSeleccionado({ ...sitioActual });
        setZonaSeleccionada(sitioActual.zona ? { ...sitioActual.zona } : null);
      }
    }
  }, [sitios, report.site?.id]);

  const fetchSitios = async () => {
    try {
      const data = await getAllSitios();
      setSitios(data);
    } catch (error) {
      console.error("Error al cargar sitios:", error);
      setError("Error al cargar los sitios disponibles");
    }
  };

  const fetchZonas = async () => {
    try {
      const data = await getAllZonas();
      setZonas(data);
    } catch (error) {
      console.error("Error al cargar zonas:", error);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (report.report_regular) {
      const reportRegular = report.report_regular;
      
      // Cargar datos químicos si existen
      if (reportRegular.sample_chemical) {
        setGrupoSeleccionado("grupo1");
        setGrupo1Data({
          ph: reportRegular.sample_chemical.ph?.toString() || "",
          conductividad: reportRegular.sample_chemical.conductivity?.toString() || "",
          na: reportRegular.sample_chemical.Na?.toString() || "",
        });
      }
      // Cargar datos isotópicos si existen
      else if (reportRegular.sample_isotopo) {
        setGrupoSeleccionado("grupo2");
        setGrupo2Data({
          delta_2h: (reportRegular.sample_isotopo.δ2H || reportRegular.sample_isotopo['δ2H'])?.toString() || "",
          delta_18o: reportRegular.sample_isotopo['18O']?.toString() || "",
        });
      }
      // Cargar nivel freático si existe
      else if (reportRegular.sample_level) {
        setGrupoSeleccionado("grupo3");
        setGrupo3Data({
          nivel_freatico: reportRegular.sample_level.freaticLevel?.toString() || "",
        });
      }
    }
  }, [report]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "site_id") {
      const sitio = sitios.find(s => s.id === parseInt(value));
      if (sitio) {
        setFormData(prev => ({
          ...prev,
          site_id: value,
          zona_id: sitio.zona_id
        }));
        setSitioSeleccionado({ ...sitio });
        setZonaSeleccionada(sitio.zona ? { ...sitio.zona } : null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Construir objeto de calidad del agua basado en el grupo seleccionado
      const waterQuality: any = {};
      
      if (grupoSeleccionado === "grupo1") {
        // Grupo 1: pH, Conductividad, Na
        if (grupo1Data.ph) waterQuality.ph = parseFloat(grupo1Data.ph);
        if (grupo1Data.conductividad) waterQuality.conductividad = parseFloat(grupo1Data.conductividad);
        if (grupo1Data.na) waterQuality.na_mg_l = parseFloat(grupo1Data.na);
      } else if (grupoSeleccionado === "grupo2") {
        // Grupo 2: δ2H, δ¹⁸O
        if (grupo2Data.delta_2h) waterQuality.delta_2h = parseFloat(grupo2Data.delta_2h);
        if (grupo2Data.delta_18o) waterQuality.o_180 = parseFloat(grupo2Data.delta_18o);
      } else if (grupoSeleccionado === "grupo3") {
        // Grupo 3: Nivel Freático
        if (grupo3Data.nivel_freatico) waterQuality.nivel_freatico = parseFloat(grupo3Data.nivel_freatico);
      }

      const payload: any = {
        note: formData.note,
        site_id: parseInt(formData.site_id),
        zona_id: parseInt(formData.zona_id),
      };

      if (report.report_regular) {
        payload.report_regular = {
          amount: parseFloat(formData.amount),
        };
      }

      // Solo agregar water_quality si tiene datos
      if (Object.keys(waterQuality).length > 0) {
        payload.water_quality = waterQuality;
      }

      await updateReporte(report.id, payload);
      setSuccess(true);
      setTimeout(() => {
        goReports();
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar reporte:", error);
      setError("Hubo un problema al actualizar el reporte. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const isPrecipitacionLluvia = report.site?.event_id === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  
      <div className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Editar Reporte</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

     
      <div className="flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-7xl">
          
          {/* Info Card del reporte - full width */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-lg font-bold">
                    #{report.id}
                  </span>
                  {report.report_regular && (
                    <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-semibold">
                      Regular
                    </span>
                  )}
                  {!report.report_regular && (
                    <span className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-md text-sm font-semibold">
                      Rotura
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">{report.date}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${isPrecipitacionLluvia ? 'bg-blue-100' : 'bg-cyan-100'}`}>
                {isPrecipitacionLluvia ? (
                  <Droplet className="w-6 h-6 text-blue-600" />
                ) : (
                  <Snowflake className="w-6 h-6 text-cyan-600" />
                )}
              </div>
            </div>
          </div>

          {/* Mensajes de éxito/error - full width */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-800">¡Reporte actualizado exitosamente!</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Grid de dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* FORMULARIO IZQUIERDO - Datos de precipitación */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
                <Droplets className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-800">Datos de Precipitación</h3>
              </div>

              {/* Campo Nota */}
              <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText size={18} className="text-slate-500" />
                Nota
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 transition resize-none"
                placeholder="Escribe una nota descriptiva..."
              />
            </div>

            {/* Cantidad de precipitación (solo si es reporte regular) */}
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 transition"
                    placeholder="Ej: 12.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    {report.report_regular.united_measure.abbreviation}
                  </span>
                </div>
              </div>
            )}

            {/* Sitio (Select dinámico) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Locate size={18} className="text-slate-500" />
                Sitio
              </label>
              <select
                name="site_id"
                value={formData.site_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 transition"
              >
                <option value="">Seleccione un sitio</option>
                {sitios.map(sitio => (
                  <option key={sitio.id} value={sitio.id}>
                    {sitio.zona?.locality} - Lat: {sitio.latitude}, Lon: {sitio.longitude}
                    {sitio.event && ` (${sitio.event.type})`}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500 mt-1.5 block">
                Al cambiar el sitio, la zona se actualizará automáticamente
              </span>
            </div>

            {/* Zona (solo lectura) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <MapPin size={18} className="text-slate-500" />
                Zona (automática)
              </label>
              <input
                type="text"
                value={zonaSeleccionada?.locality || ""}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                placeholder="Seleccione un sitio primero"
              />
              <span className="text-xs text-slate-500 mt-1.5 block">
                La zona se asigna automáticamente según el sitio seleccionado
              </span>
            </div>

            {/* Coordenadas (solo lectura - informativas) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <MapPin size={18} className="text-slate-500" />
                Coordenadas del Sitio
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                    Latitud
                  </label>
                  <span className="text-slate-700 font-mono text-sm font-semibold">
                    {sitioSeleccionado?.latitude || 'N/A'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                    Longitud
                  </label>
                  <span className="text-slate-700 font-mono text-sm font-semibold">
                    {sitioSeleccionado?.longitude || 'N/A'}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-500 mt-1.5 block">
                Las coordenadas son del sitio seleccionado y no se pueden editar directamente
              </span>
            </div>

       
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                Resumen de cambios
              </h4>
              <div className="space-y-2 text-sm">
                {formData.note !== report.note && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Nota modificada</span>
                  </div>
                )}
                {report.report_regular && formData.amount !== report.report_regular?.amount && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Cantidad actualizada</span>
                  </div>
                )}
                {formData.site_id !== report.site?.id && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Sitio modificado</span>
                  </div>
                )}
                {formData.zona_id !== report.site?.zona_id && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Zona actualizada</span>
                  </div>
                )}
                {formData.note === report.note && 
                 formData.amount === report.report_regular?.amount && 
                 formData.site_id === report.site?.id && 
                 formData.zona_id === report.site?.zona_id && (
                  <div className="text-slate-500 italic">Sin cambios realizados</div>
                )}
              </div>
            </div>
            </div>
            {/* FIN FORMULARIO IZQUIERDO */}


            {/* FORMULARIO DERECHO - Calidad del Agua */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
                <Droplet className="w-6 h-6 text-cyan-600" />
                <h3 className="text-lg font-bold text-slate-800">Parámetros de Calidad del Agua</h3>
              </div>

              {/* SELECTOR DE GRUPO */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-bold text-cyan-800 mb-3">
                  <FileText size={20} className="text-cyan-600" />
                  Seleccione el Grupo de Parámetros
                </label>
                <select
                  value={grupoSeleccionado}
                  onChange={(e) => {
                    setGrupoSeleccionado(e.target.value);
                    // Limpiar datos de todos los grupos al cambiar
                    setGrupo1Data({ ph: "", conductividad: "", na: "" });
                    setGrupo2Data({ delta_2h: "", delta_18o: "" });
                    setGrupo3Data({ nivel_freatico: "" });
                  }}
                  className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-700 font-semibold transition"
                >
                  <option value="">-- Seleccione un grupo --</option>
                  <option value="grupo1">📊 Grupo 1: Parámetros Químicos (pH, Conductividad, Na)</option>
                  <option value="grupo2">🧪 Grupo 2: Isótopos (δ2H, δ¹⁸O)</option>
                  <option value="grupo3">🌊 Grupo 3: Hidrogeología (Nivel Freático)</option>
                </select>
              </div>

              {/* FORMULARIOS CONDICIONALES POR GRUPO */}
              
              {/* GRUPO 1: pH, Conductividad, Na */}
              {grupoSeleccionado === "grupo1" && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <h4 className="font-bold text-slate-800 text-base mb-3 pb-2 border-b border-slate-300">
                    📊 Grupo 1: Parámetros Químicos
                  </h4>
                  
                  {/* pH */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      pH
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={grupo1Data.ph}
                      onChange={(e) => setGrupo1Data({...grupo1Data, ph: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-700 transition"
                      placeholder="Ej: 7.2"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Unidad: Escala pH (0-14)</span>
                  </div>

                  {/* Conductividad */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      Conductividad
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={grupo1Data.conductividad}
                      onChange={(e) => setGrupo1Data({...grupo1Data, conductividad: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-700 transition"
                      placeholder="Ej: 250.5"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Unidad: µS/cm (Microsiemens por centímetro)</span>
                  </div>

                  {/* Na (Sodio) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      Na (Sodio)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={grupo1Data.na}
                      onChange={(e) => setGrupo1Data({...grupo1Data, na: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-700 transition"
                      placeholder="Ej: 15.3"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Unidad: mg/l (Miligramos por litro)</span>
                  </div>
                </div>
              )}

              {/* GRUPO 2: δ2H, δ¹⁸O */}
              {grupoSeleccionado === "grupo2" && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <h4 className="font-bold text-slate-800 text-base mb-3 pb-2 border-b border-slate-300">
                    🧪 Grupo 2: Isótopos
                  </h4>
                  
                  {/* δ2H */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      δ2H (Delta Deuterio)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={grupo2Data.delta_2h}
                      onChange={(e) => setGrupo2Data({...grupo2Data, delta_2h: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-700 transition"
                      placeholder="Ej: -45.2"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Unidad: ‰ (Por mil)</span>
                  </div>

                  {/* δ¹⁸O */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      δ¹⁸O (Delta Oxígeno-18)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={grupo2Data.delta_18o}
                      onChange={(e) => setGrupo2Data({...grupo2Data, delta_18o: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-700 transition"
                      placeholder="Ej: -7.5"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Unidad: ‰ (Por mil)</span>
                  </div>
                </div>
              )}

              {/* GRUPO 3: Nivel Freático */}
              {grupoSeleccionado === "grupo3" && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <h4 className="font-bold text-slate-800 text-base mb-3 pb-2 border-b border-slate-300">
                    🌊 Grupo 3: Hidrogeología
                  </h4>
                  
                  {/* Nivel Freático */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      Nivel Freático
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={grupo3Data.nivel_freatico}
                      onChange={(e) => setGrupo3Data({...grupo3Data, nivel_freatico: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-700 transition"
                      placeholder="Ej: 3.5"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">Unidad: m (Metros)</span>
                  </div>
                </div>
              )}

              {/* Resumen de Parámetros Ingresados */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-cyan-800 uppercase tracking-wide mb-3">
                  Resumen de Datos Ingresados
                </h4>
                <div className="space-y-2 text-sm">
                  {grupoSeleccionado === "grupo1" && (
                    <>
                      <div className="font-bold text-cyan-700 mb-2">📊 Grupo 1: Parámetros Químicos</div>
                      {grupo1Data.ph && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>pH: {grupo1Data.ph}</span>
                        </div>
                      )}
                      {grupo1Data.conductividad && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Conductividad: {grupo1Data.conductividad} µS/cm</span>
                        </div>
                      )}
                      {grupo1Data.na && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Na: {grupo1Data.na} mg/l</span>
                        </div>
                      )}
                      {!grupo1Data.ph && !grupo1Data.conductividad && !grupo1Data.na && (
                        <div className="text-slate-500 italic">Sin datos del Grupo 1</div>
                      )}
                    </>
                  )}
                  
                  {grupoSeleccionado === "grupo2" && (
                    <>
                      <div className="font-bold text-cyan-700 mb-2">🧪 Grupo 2: Isótopos</div>
                      {grupo2Data.delta_2h && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>δ2H: {grupo2Data.delta_2h} ‰</span>
                        </div>
                      )}
                      {grupo2Data.delta_18o && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>δ¹⁸O: {grupo2Data.delta_18o} ‰</span>
                        </div>
                      )}
                      {!grupo2Data.delta_2h && !grupo2Data.delta_18o && (
                        <div className="text-slate-500 italic">Sin datos del Grupo 2</div>
                      )}
                    </>
                  )}
                  
                  {grupoSeleccionado === "grupo3" && (
                    <>
                      <div className="font-bold text-cyan-700 mb-2">🌊 Grupo 3: Hidrogeología</div>
                      {grupo3Data.nivel_freatico && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>Nivel Freático: {grupo3Data.nivel_freatico} m</span>
                        </div>
                      )}
                      {!grupo3Data.nivel_freatico && (
                        <div className="text-slate-500 italic">Sin datos del Grupo 3</div>
                      )}
                    </>
                  )}
                  
                  {!grupoSeleccionado && (
                    <div className="text-slate-500 italic">Seleccione un grupo para ingresar datos</div>
                  )}
                </div>
              </div>
            </div>
            {/* FIN FORMULARIO DERECHO */}

          </div>
          {/* FIN GRID */}

          {/* Botones de Acción - full width */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando cambios...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={20} />
                  ¡Guardado!
                </>
              ) : (
                <>
                  <Save size={20} className="transition-transform group-hover:scale-110" />
                  Guardar Cambios
                </>
              )}
            </button>
            <button
              type="button"
              onClick={goReports}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-slate-200 group"
            >
              <X size={20} className="transition-transform group-hover:rotate-90" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditReport;