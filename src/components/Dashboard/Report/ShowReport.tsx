import { useEffect, useState } from "react";
import useReports from "../../../hooks/useReports";
import useNavegation from "../../../hooks/useNavegation";
import { getAllZonas } from "../../../services/zonaService";
import { ArrowLeft, Pencil, Search, Filter, Droplet, Snowflake, FileText, AlertTriangle, MapPin, Volume2, Play, Pause, X } from "lucide-react";
import BackButton from "../../BackButton";
import IconNavMenu from "../../IconNavMenu";
import { buildImageUrl, buildAudioUrl } from "../../../utils/urlBuilder";

const ShowReport = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"all" | "regular" | "rotura">("all");
  const [filterPrecipitation, setFilterPrecipitation] = useState<"all" | "lluvia" | "nieve">("all");
  const [filterZona, setFilterZona] = useState<string>("all");
  const [zonas, setZonas] = useState<any[]>([]);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { goEditReport } = useNavegation();
  const reports = useReports();

  // Cargar zonas al montar el componente
  useEffect(() => {
    fetchZonas();
  }, []);

  const fetchZonas = async () => {
    try {
      const data = await getAllZonas();
      setZonas(data);
    } catch (error) {
      console.error("Error al cargar zonas:", error);
    }
  };

  useEffect(() => {
    let result = reports;

    // Filtro por tipo de reporte
    if (filterType !== "all") {
      result = result.filter((r) => {
        if (filterType === "regular") return r.report_regular !== null;
        if (filterType === "rotura") return r.report_regular === null;
        return true;
      });
    }

    // Filtro por tipo de precipitación
    if (filterPrecipitation !== "all") {
      result = result.filter((r) => {
        if (filterPrecipitation === "lluvia") return r.site?.event_id === 1;
        if (filterPrecipitation === "nieve") return r.site?.event_id === 2;
        return true;
      });
    }

    // Filtro por zona
    if (filterZona !== "all") {
      result = result.filter((r) => r.site?.zona_id === parseInt(filterZona));
    }

    // Búsqueda por texto
    if (search.trim() !== "") {
      result = result.filter(
        (r) =>
          r.id.toString().includes(search) ||
          r.note?.toLowerCase().includes(search.toLowerCase()) ||
          r.site?.zona?.locality?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, reports, filterType, filterPrecipitation, filterZona]);

  const handleAudioPlay = (reportId: number) => {
    setPlayingAudio(reportId);
  };

  const handleAudioPause = () => {
    setPlayingAudio(null);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        
        <BackButton />

        <IconNavMenu />

        
        {/* Header mejorado */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Reportes
              </h1>
              <p className="text-base text-slate-600 mt-1 font-medium">
                {filtered.length} {filtered.length === 1 ? "reporte encontrado" : "reportes encontrados"}
              </p>
            </div>
          </div>
        </div>

        {/* Controles de búsqueda y filtros mejorados */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8 mb-6">
          
          {/* Buscador mejorado */}
          <div className="relative mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por ID, nota o zona..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50/80 border-2 border-slate-200 rounded-2xl 
                       focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                       transition-all duration-200 text-slate-700 placeholder:text-slate-400
                       hover:border-slate-300 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

            {/* Filtros en grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Filtro: Tipo de Reporte */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <FileText className="w-5 h-5 text-blue-600" />
              Tipo de Reporte
              </label>
              <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200
                  ${filterType === "all"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30 scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                  }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType("regular")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2
                  ${filterType === "regular"
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/30 scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                  }`}
              >
                <FileText className="w-5 h-5" />
                Regular
              </button>
              <button
                onClick={() => setFilterType("rotura")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2
                  ${filterType === "rotura"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                  }`}
              >
                <AlertTriangle className="w-5 h-5" />
                Rotura
              </button>
              </div>
            </div>

            {/* Filtro: Precipitación */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <Droplet className="w-5 h-5 text-blue-600" />
              Precipitación
              </label>
              <div className="flex gap-2">
              <button
                onClick={() => setFilterPrecipitation("all")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200
                  ${filterPrecipitation === "all"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30 scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                  }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterPrecipitation("lluvia")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2
                  ${filterPrecipitation === "lluvia"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                  }`}
              >
                <Droplet className="w-5 h-5" />
                Lluvia
              </button>
              <button
                onClick={() => setFilterPrecipitation("nieve")}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2
                  ${filterPrecipitation === "nieve"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                  }`}
              >
                <Snowflake className="w-5 h-5" />
                Nieve
              </button>
              </div>
            </div>

            {/* Filtro: Zona (dinámico) */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <MapPin className="w-5 h-5 text-blue-600" />
                Zona
              </label>
              <select
                value={filterZona}
                onChange={(e) => setFilterZona(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 hover:border-slate-300 text-slate-700 font-medium text-base transition-all duration-200"
              >
                <option value="all">Todas las zonas</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.locality}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <span className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 bg-blue-50 px-5 py-3 rounded-xl">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              {filtered.length} {filtered.length === 1 ? "reporte encontrado" : "reportes encontrados"}
            </span>
          </div>
        </div>

        {/* Lista de reportes */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl">
            <div className="bg-slate-100 rounded-full p-6 mb-4 shadow-lg shadow-slate-500/10">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No se encontraron reportes</h3>
            <p className="text-base text-slate-500">Intenta ajustar los filtros o la búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((reporte) => (
              <div
                key={reporte.id}
                className="group bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-300 hover:scale-[1.02] transition-all duration-300"
              >
                {/* Header de la tarjeta */}
                <div className="bg-gradient-to-r from-slate-50 via-blue-50/50 to-slate-50 p-5 border-b-2 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-base font-bold shadow-lg shadow-blue-600/30">
                      #{reporte.id}
                    </span>
                    {reporte.report_regular && (
                      <span className="bg-green-100 text-green-700 border-2 border-green-300 px-3 py-1.5 rounded-lg text-sm font-bold">
                        Regular
                      </span>
                    )}
                    {!reporte.report_regular && (
                      <span className="bg-red-100 text-red-700 border-2 border-red-300 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Rotura
                      </span>
                    )}
                  </div>
                  {reporte.site?.event_id === 1 ? (
                    <div className="bg-blue-100 p-3 rounded-xl shadow-md shadow-blue-500/20">
                      <Droplet className="w-6 h-6 text-blue-600" />
                    </div>
                  ) : (
                    <div className="bg-cyan-100 p-3 rounded-xl shadow-md shadow-cyan-500/20">
                      <Snowflake className="w-6 h-6 text-cyan-600" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    {/* Información */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 text-base font-medium min-w-[70px]">Fecha:</span>
                        <span className="text-slate-800 text-base font-bold">{reporte.date}</span>
                      </div>
                      
                      {reporte.note && (
                        <div className="flex items-start gap-2">
                          <span className="text-slate-500 text-base font-medium min-w-[70px]">Nota:</span>
                          <span className="text-slate-700 text-base italic line-clamp-2">{reporte.note}</span>
                        </div>
                      )}

                      {reporte.report_regular && (
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg shadow-blue-500/10">
                          <span className="text-blue-900 font-bold text-2xl">
                            {reporte.report_regular.amount} {reporte.report_regular.united_measure.abbreviation}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Imagen */}
                    <div className="w-32 h-32 flex-shrink-0">
                      {reporte.image ? (
                        <img
                          src={buildImageUrl(reporte.image)}
                          alt="Reporte"
                          onClick={() => openImageModal(buildImageUrl(reporte.image))}
                          className="w-full h-full object-cover rounded-2xl border-2 border-slate-200 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 border-2 border-slate-200 rounded-2xl flex items-center justify-center">
                          <span className="text-slate-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>
                  </div>

                    {/* Reproductor de Audio */}
                    {reporte.audio && (
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                      <div className="bg-slate-200 p-2 rounded-xl shadow-sm">
                        <Volume2 className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className="text-base font-bold text-slate-800">Audio del Reporte</span>
                      </div>
                      <audio
                      controls
                      className="w-full h-10 rounded-xl"
                      onPlay={() => handleAudioPlay(reporte.id)}
                      onPause={handleAudioPause}
                      >
                      <source src={buildAudioUrl(reporte.audio)} type="audio/mpeg" />
                      <source src={buildAudioUrl(reporte.audio)} type="audio/wav" />
                      <source src={buildAudioUrl(reporte.audio)} type="audio/ogg" />
                      <source src={buildAudioUrl(reporte.audio)} type="audio/mp4" />
                      Tu navegador no soporta el elemento de audio.
                      </audio>  
                    </div>
                    )}

                  {/* Ubicación */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 shadow-md">
                    <div className="flex items-start gap-3 mb-2">
                      <MapPin className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        {reporte.site.nombre && (
                          <span className="text-base font-bold text-slate-800">{reporte.site.nombre}</span>
                        )}
                        <span className="text-base font-semibold text-slate-700">{reporte.site.zona.locality}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Lat:</span> <span className="font-mono">{reporte.site.latitude}</span>
                      </div>
                      <div>
                        <span className="font-medium">Lng:</span> <span className="font-mono">{reporte.site.longitude}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón editar */}
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 group/btn text-base"
                    onClick={() => goEditReport(reporte)}
                  >
                    <Pencil size={20} className="transition-transform group-hover/btn:rotate-12" />
                    Editar Reporte
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de imagen ampliada */}
      {imageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowReport;