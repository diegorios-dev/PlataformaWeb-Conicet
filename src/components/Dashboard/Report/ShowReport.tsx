import { useEffect, useState } from "react";
import useReports from "../../../hooks/useReports";
import useNavegation from "../../../hooks/useNavegation";
import { getAllZonas } from "../../../services/zonaService";
import {Pencil, Search, Droplet, Snowflake, FileText, AlertTriangle, MapPin, Waves, Mic, X } from "lucide-react";
import BackButton from "../../BackButton";
import IconNavMenu from "../../Menu/IconNavMenu";
import { buildImageUrl, buildAudioUrl } from "../../../utils/urlBuilder";
import { EmptyState } from "../../ui/LoadingState";

const ShowReport = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"all" | "regular" | "rotura">("all");
  const [filterPrecipitation, setFilterPrecipitation] = useState<"all" | "lluvia" | "nieve" | "caudal">("all");
  const [filterZona, setFilterZona] = useState<string>("all");
  const [zonas, setZonas] = useState<any[]>([]);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { goEditReport, goResolveRotura } = useNavegation();
  const reports = useReports();

  const handleEditClick = (reporte: any) => {
    if (reporte.type === "rotura") {
      // Si es un reporte de rotura, navegar al formulario de resolución
      goEditReport(reporte); // Esto guardará el reporte en el contexto
      goResolveRotura(); // Navegar sin recargar la página
    } else {
      // Si es un reporte regular, usar el flujo normal
      goEditReport(reporte);
    }
  };

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
        // Usar el campo 'type' que viene del backend
        if (filterType === "regular") return r.type === "regular";
        if (filterType === "rotura") return r.type === "rotura";
        return true;
      });
    }

    // Filtro por tipo de precipitación
    if (filterPrecipitation !== "all") {
      result = result.filter((r) => {
        if (filterPrecipitation === "lluvia") return r.site?.event_id === 1;
        if (filterPrecipitation === "nieve") return r.site?.event_id === 2;
        if (filterPrecipitation === "caudal") return r.site?.event_id === 3;
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

        {/* Controles de búsqueda y filtros - Diseño iOS/SaaS Premium */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[24px] shadow-2xl shadow-slate-900/5 p-6 md:p-8 mb-6 transition-all duration-300 hover:shadow-slate-900/10">
          
          {/* Buscador estilo iOS */}
          <div className="relative mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 pointer-events-none" size={20} />
            <input
              type="text"
              placeholder="Buscar por ID, nota o zona..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-200/80 rounded-[16px] 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 focus:bg-white
                       transition-all duration-300 text-slate-700 text-[15px] placeholder:text-slate-400
                       hover:border-slate-300/80 hover:bg-white/80 shadow-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all duration-200 group"
              >
                <X size={14} className="text-slate-600 group-hover:text-slate-900" />
              </button>
            )}
          </div>

          {/* Filtros en grid responsive - Estética iOS */}
          <div className="space-y-7">
            
            {/* Filtro: Tipo de Reporte */}
            <div className="space-y-3.5">
              <label className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700 uppercase tracking-[0.08em] px-0.5">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Tipo de Reporte
              </label>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setFilterType("all")}
                  className={`flex-1 px-5 py-3.5 rounded-[14px] font-semibold text-[15px] transition-all duration-300 
                    shadow-sm active:scale-[0.98] relative overflow-hidden group
                    ${filterType === "all"
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25 ring-2 ring-slate-900 ring-offset-2"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md border border-slate-200/80"
                    }`}
                >
                  <span className="relative z-10">Todos</span>
                  {filterType === "all" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
                <button
                  onClick={() => setFilterType("regular")}
                  className={`flex-1 px-5 py-3.5 rounded-[14px] font-semibold text-[15px] transition-all duration-300 
                    shadow-sm active:scale-[0.98] relative overflow-hidden group flex items-center justify-center gap-2
                    ${filterType === "regular"
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-500 ring-offset-2"
                      : "bg-slate-50 text-slate-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md border border-slate-200/80"
                    }`}
                >
                  <FileText className="w-[18px] h-[18px]" />
                  <span className="relative z-10">Regular</span>
                  {filterType === "regular" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
                <button
                  onClick={() => setFilterType("rotura")}
                  className={`flex-1 px-5 py-3.5 rounded-[14px] font-semibold text-[15px] transition-all duration-300 
                    shadow-sm active:scale-[0.98] relative overflow-hidden group flex items-center justify-center gap-2
                    ${filterType === "rotura"
                      ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-500 ring-offset-2"
                      : "bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:shadow-md border border-slate-200/80"
                    }`}
                >
                  <AlertTriangle className="w-[18px] h-[18px]" />
                  <span className="relative z-10">Rotura</span>
                  {filterType === "rotura" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Filtro: Evento y Zona en la misma fila */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              
              {/* Filtro: Precipitación */}
              <div className="space-y-3.5">
                <label className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700 uppercase tracking-[0.08em] px-0.5">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Droplet className="w-4 h-4 text-blue-600" />
                  </div>
                  Evento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => setFilterPrecipitation("all")}
                    className={`px-4 py-3 rounded-[14px] font-semibold text-[14px] transition-all duration-300 
                      shadow-sm active:scale-[0.98] relative overflow-hidden
                      ${filterPrecipitation === "all"
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25 ring-2 ring-slate-900 ring-offset-2"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md border border-slate-200/80"
                      }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterPrecipitation("lluvia")}
                    className={`px-4 py-3 rounded-[14px] font-semibold text-[14px] transition-all duration-300 
                      shadow-sm active:scale-[0.98] flex items-center justify-center gap-2
                      ${filterPrecipitation === "lluvia"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2"
                        : "bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md border border-slate-200/80"
                      }`}
                  >
                    <Droplet className="w-[16px] h-[16px]" />
                    Lluvia
                  </button>
                  <button
                    onClick={() => setFilterPrecipitation("nieve")}
                    className={`px-4 py-3 rounded-[14px] font-semibold text-[14px] transition-all duration-300 
                      shadow-sm active:scale-[0.98] flex items-center justify-center gap-2
                      ${filterPrecipitation === "nieve"
                        ? "bg-gradient-to-br from-cyan-400 to-sky-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400 ring-offset-2"
                        : "bg-slate-50 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-md border border-slate-200/80"
                      }`}
                  >
                    <Snowflake className="w-[16px] h-[16px]" />
                    Nieve
                  </button>
                  <button
                    onClick={() => setFilterPrecipitation("caudal")}
                    className={`px-4 py-3 rounded-[14px] font-semibold text-[14px] transition-all duration-300 
                      shadow-sm active:scale-[0.98] flex items-center justify-center gap-2
                      ${filterPrecipitation === "caudal"
                        ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 ring-2 ring-teal-500 ring-offset-2"
                        : "bg-slate-50 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md border border-slate-200/80"
                      }`}
                  >
                    <Waves className="w-[16px] h-[16px]" />
                    Caudal
                  </button>
                </div>
              </div>

              {/* Filtro: Zona (dinámico) - Estilo iOS Select */}
              <div className="space-y-3.5">
                <label className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700 uppercase tracking-[0.08em] px-0.5">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  Zona
                </label>
                <select
                  value={filterZona}
                  onChange={(e) => setFilterZona(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-[14px] 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 focus:bg-white
                           hover:border-slate-300/80 hover:bg-white/80 text-slate-700 font-semibold text-[15px] 
                           transition-all duration-300 shadow-sm cursor-pointer
                           appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjNjQ3NDhCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] 
                           bg-[length:16px] bg-[right_1.25rem_center] bg-no-repeat pr-12"
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
          </div>

          {/* Contador de resultados - Badge dinámico estilo iOS */}
          <div className="mt-7 pt-6 border-t border-slate-100">
            <div className="inline-flex items-center gap-3 text-[15px] font-semibold text-slate-800 
                          bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 rounded-[14px] 
                          shadow-sm border border-blue-100/50 transition-all duration-300 hover:shadow-md">
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span className="absolute w-2 h-2 bg-blue-600 rounded-full animate-ping opacity-75"></span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                {filtered.length}
              </span>
              <span className="text-slate-600 font-medium">
                {filtered.length === 1 ? "reporte encontrado" : "reportes encontrados"}
              </span>
            </div>
          </div>
        </div>
        {/* Lista de reportes */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No se encontraron reportes"
            description="Intenta ajustar los filtros o la búsqueda"
          />
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
                    {reporte.type === "regular" && (
                      <span className="bg-green-100 text-green-700 border-2 border-green-300 px-3 py-1.5 rounded-lg text-sm font-bold">
                        Regular
                      </span>
                    )}
                    {reporte.type === "rotura" && (
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
                  ) : reporte.site?.event_id === 2 ? (
                    <div className="bg-cyan-100 p-3 rounded-xl shadow-md shadow-cyan-500/20">
                      <Snowflake className="w-6 h-6 text-cyan-600" />
                    </div>
                  ) : reporte.site?.event_id === 3 ? (
                    <div className="bg-teal-100 p-3 rounded-xl shadow-md shadow-teal-500/20">
                      <Waves className="w-6 h-6 text-teal-600" />
                    </div>
                  ) : null}
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
                        <Mic className="w-5 h-5 text-slate-600" />
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
                    className={`w-full font-bold py-4 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 group/btn text-base ${
                      reporte.type === "rotura"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-600/30"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/30"
                    }`}
                    onClick={() => handleEditClick(reporte)}
                  >
                    <Pencil size={20} className="transition-transform group-hover/btn:rotate-12" />
                    {reporte.type === "rotura" ? "Resolver Rotura" : "Editar Reporte"}
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