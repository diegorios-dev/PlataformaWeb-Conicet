import { useEffect, useState } from "react";
import { getAllSitios, postNewSite } from "../../../services/sitiosService";
import { deleteSite, updateSite } from "../../../services/sitiosService";
import { Pencil, Trash2, Plus, Save, X, Search, MapPin, AlertCircle } from "lucide-react";
import Toast from "../../ui/Toast";
import useNavegation  from "../../../hooks/useNavegation";
import IconNavMenu from "../../Menu/IconNavMenu";

const AdminSitios = () => {
  const { goAddSite } = useNavegation();
  const [sitios, setSitios] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filterZona, setFilterZona] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSitio, setSelectedSitio] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSitios();
  }, []);

  const fetchSitios = async () => {
    try {
      const data = await getAllSitios();
      setSitios(data);
    } catch (error) {
      setToastType("error");
      setToastMessage("Error al cargar sitios");
      setToastOpen(true);
    }
  };

  useEffect(() => {
    let result = sitios;
    if (filterZona !== "all") {
      result = result.filter((s) => s.zona_id === filterZona);
    }
    if (search.trim() !== "") {
      result = result.filter(
        (s) =>
          s.nombre?.toLowerCase().includes(search.toLowerCase()) ||
          s.latitude?.toString().includes(search) ||
          s.longitude?.toString().includes(search)
      );
    }
    setFiltered(result);
  }, [search, sitios, filterZona]);

  const handleOpenModal = (sitio?: any) => {
    setEditMode(!!sitio);
    setSelectedSitio(sitio || null);
    setFormData(sitio ? { ...sitio } : {});
    setModalOpen(true);
  };

  const handleDeleteClick = (sitio: any) => {
    setSelectedSitio(sitio);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteSite = async () => {
    if (!selectedSitio) return;
    setDeleting(true);
    try {
      await deleteSite(selectedSitio.id);
      setToastType("success");
      setToastMessage("Sitio eliminado correctamente");
      setToastOpen(true);
      setConfirmDeleteOpen(false);
      fetchSitios();
    } catch (error) {
      setToastType("error");
      setToastMessage("Error al eliminar sitio");
      setToastOpen(true);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSitio(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && selectedSitio) {
        await updateSite(selectedSitio.id, formData);
        setToastType("success");
        setToastMessage("Sitio editado correctamente");
      } else {
        await postNewSite(formData);
        setToastType("success");
        setToastMessage("Sitio creado correctamente");
      }
      setToastOpen(true);
      setModalOpen(false);
      fetchSitios();
    } catch (error) {
      setToastType("error");
      setToastMessage("Error al guardar sitio");
      setToastOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        
        <IconNavMenu />
        
        {/* Header premium - igual a ViewManagementUsers */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Gestión de Sitios
              </h1>
              <p className="text-base text-slate-600 mt-1 font-medium">
                {filtered.length} {filtered.length === 1 ? "sitio registrado" : "sitios registrados"}
              </p>
            </div>
          </div>
        </div>

        {/* Controles de búsqueda y acciones */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
            <button
              onClick={goAddSite}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 text-base group"
            >
              <Plus size={20} className="transition-transform group-hover:rotate-12" />
              Nuevo Sitio
            </button>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, latitud, longitud..."
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-slate-700 text-base placeholder:text-slate-400 font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-200 hover:bg-slate-300"
                  >
                    <X size={14} className="text-slate-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200">
            <span className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 bg-blue-50 px-5 py-3 rounded-xl">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              {filtered.length} {filtered.length === 1 ? "sitio" : "sitios"}
            </span>
          </div>
        </div>

        {/* Modal de confirmación para eliminar sitio */}
        {confirmDeleteOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-2xl mb-4 bg-red-100">
                  <Trash2 className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-red-900">Confirmar eliminación</h3>
                <p className="text-base mb-6 text-red-700">¿Estás seguro que querés eliminar el sitio <b>{selectedSitio?.nombre}</b>? Esta acción no se puede deshacer.</p>
                <div className="flex justify-center gap-3 w-full">
                  <button
                    onClick={() => setConfirmDeleteOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteSite}
                    disabled={deleting}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla grilla de sitios */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl">
            <div className="bg-slate-100 rounded-full p-6 mb-4 shadow-lg shadow-slate-500/10">
              <MapPin className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay sitios registrados</h3>
            <p className="text-base text-slate-500 mb-6">Agregá tu primer sitio para comenzar</p>
            <button
              onClick={goAddSite}
              className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 text-base"
            >
              <Plus size={20} />
              Agregar Sitio
            </button>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Latitud</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Longitud</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Zona</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Evento</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cota</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((sitio) => (
                    <tr key={sitio.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">#{sitio.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900">{sitio.nombre}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">{sitio.latitude}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">{sitio.longitude}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">{sitio.zona_id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">{sitio.event_id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200">{sitio.cota}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenModal(sitio)} className="group flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200 transition-all duration-200">
                            <Pencil size={14} className="transition-transform group-hover:rotate-12" />
                            Editar
                          </button>
                          <button onClick={() => handleDeleteClick(sitio)} disabled={deleting} className="group flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold border border-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            {deleting && selectedSitio?.id === sitio.id ? (
                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                            ) : (
                              <Trash2 size={14} className="transition-transform group-hover:scale-110" />
                            )}
                            {deleting && selectedSitio?.id === sitio.id ? "..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-3 rounded-xl shadow-sm flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-blue-900 mb-1">Gestión de Sitios</h4>
              <p className="text-sm text-blue-800">
                Administra los sitios del sistema. Cada sitio representa una ubicación de medición y puede estar asociado a una zona y evento. Utiliza las acciones para editar o eliminar sitios según corresponda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar sitio */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div className="relative bg-gradient-to-br from-blue-50/90 to-white/95 rounded-2xl shadow-2xl p-4 max-w-sm w-full transform transition-all duration-300 border border-blue-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mb-2">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1 text-blue-900 tracking-tight">
                {editMode ? "Editar Sitio" : "Registrar Sitio"}
              </h3>
              <p className="text-sm text-blue-700 mb-3 font-medium">
                {editMode ? "Modifica los datos del sitio seleccionado" : "Completa la información para registrar un nuevo sitio"}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4 w-full mt-1">
                <div>
                  <label className="text-gray-700 text-xs font-bold mb-1 flex items-center gap-2" htmlFor="nombre">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Nombre del Sitio
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder="Ej: Pluviómetro Norte, Estación Central..."
                    value={formData.name || ""}
                    onChange={handleChange}
                    required
                    className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="latitude">
                      Latitud
                    </label>
                    <input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="Latitud"
                      value={formData.latitude || ""}
                      onChange={handleChange}
                      required
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="longitude">
                      Longitud
                    </label>
                    <input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="Longitud"
                      value={formData.longitude || ""}
                      onChange={handleChange}
                      required
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-700 text-xs font-bold mb-1 flex items-center gap-2" htmlFor="zona_id">
                    Zona
                  </label>
                  <input
                    id="zona_id"
                    type="text"
                    placeholder="ID de zona"
                    value={formData.zona_id || ""}
                    onChange={handleChange}
                    required
                    className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-xs font-bold mb-1 flex items-center gap-2" htmlFor="event_id">
                    Evento
                  </label>
                  <input
                    id="event_id"
                    type="text"
                    placeholder="ID de evento"
                    value={formData.event_id || ""}
                    onChange={handleChange}
                    required
                    className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-xs font-bold mb-1 flex items-center gap-2" htmlFor="cota">
                    Cota (msnm)
                  </label>
                  <input
                    id="cota"
                    type="text"
                    placeholder="Ej: 1200, 850, 2100..."
                    value={formData.cota || "/"}
                    onChange={handleChange}
                    className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition font-medium text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all transform hover:scale-105 shadow-lg shadow-blue-300/50 flex items-center justify-center gap-2 text-base mt-1">
                  <Save className="w-5 h-5" /> {editMode ? "Guardar Cambios" : "Registrar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Toast isOpen={toastOpen} type={toastType} message={toastMessage} onClose={() => setToastOpen(false)} />
    </div>
  );
};

export default AdminSitios;
