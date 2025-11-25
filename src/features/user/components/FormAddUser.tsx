import { useState, useEffect } from "react";
import { postNewUser } from "@features/user/services";
import { getAllSitios } from "@features/site/services";
import { useNavegation } from "@shared/hooks";
import { DashboardLayout } from "@shared/ui/layouts/DashboardLayout/DashboardLayout";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";
import Toast from "@shared/ui/Loading/Toast";
import BackButton from "@shared/ui/buttons/BackButton";
import {
  User,
  Plus,
  Shield,
  MapPin,
  Locate,
  UserCog
} from "lucide-react";

const FormAddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    rol: "",
    site_id: "",
    zona_id: ""
  });
  
  const [sitios, setSitios] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  
  const { go } = useNavegation();

  // Cargar sitios al montar el componente
  useEffect(() => {
    fetchSitios();
  }, []);

  const fetchSitios = async () => {
    try {
      const data = await getAllSitios();
      setSitios(data);
    } catch (error) {
      console.error("Error al cargar sitios:", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "site_id") {
      const sitioSeleccionado = sitios.find(s => s.id === parseInt(value));
      
      if (sitioSeleccionado) {
        setFormData(prev => ({
          ...prev,
          site_id: value,
          zona_id: sitioSeleccionado.zona_id
        }));
        // CAMBIO IMPORTANTE: Crear una copia del objeto zona para evitar mutaciones
        setZonaSeleccionada(sitioSeleccionado.zona ? { ...sitioSeleccionado.zona } : null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        password: formData.password,
        rol: formData.rol,
        site_id: parseInt(formData.site_id),
        zona_id: parseInt(formData.zona_id)
      };
      await postNewUser(payload);
      setToastType("success");
      setToastMessage("Usuario creado exitosamente");
      setToastOpen(true);
      setTimeout(() => {
        go.back();
      }, 2000);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setToastType("error");
      setToastMessage("Error al crear usuario. Por favor intenta nuevamente.");
      setToastOpen(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-8">
        <BackButton />
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-blue-200/50 shadow-lg">
            <User className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Agregar Usuario
            </h1>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl px-12 pt-10 pb-12 border-2 border-white/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div>
              {/* Nombre */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-slate-700 text-sm font-bold mb-3" htmlFor="name">
                  <User className="w-4 h-4 text-blue-600" />
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full py-4 px-6 rounded-2xl border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-slate-700 text-sm font-bold mb-3" htmlFor="password">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Ingrese la contraseña (mínimo 6 caracteres)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full py-4 px-6 rounded-2xl border-2 border-indigo-200/50 bg-white/80 backdrop-blur-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all shadow-sm hover:shadow-md"
                />
              </div>

              {/* Rol */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-slate-700 text-sm font-bold mb-3">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Rol
                </label>
                <CustomSelect
                  options={[
                    { value: "admin", label: "Administrador", icon: <Shield className="w-4 h-4" /> },
                    { value: "user", label: "Usuario", icon: <UserCog className="w-4 h-4" /> }
                  ]}
                  value={formData.rol}
                  onChange={(value) => handleChange({ target: { id: "rol", value } })}
                  placeholder="Seleccione un rol"
                  icon={<Shield className="w-5 h-5" />}
                />
              </div>
            </div>

            {/* Columna 2 */}
            <div>
              {/* Zona (solo lectura) */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-slate-700 text-sm font-bold mb-3" htmlFor="zona">
                  <MapPin className="w-4 h-4 text-violet-600" />
                  Zona (automática)
                </label>
                <input
                  id="zona"
                  type="text"
                  value={zonaSeleccionada?.locality || ""}
                  disabled
                  placeholder="Seleccione un sitio primero"
                  className="w-full py-4 px-6 rounded-2xl border-2 border-slate-200/50 bg-slate-50/50 backdrop-blur-sm text-slate-500 font-medium cursor-not-allowed shadow-sm"
                />
              </div>

              {/* Sitio */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-slate-700 text-sm font-bold mb-3">
                  <Locate className="w-4 h-4 text-emerald-600" />
                  Sitio
                </label>
                <CustomSelect
                  options={sitios.map(sitio => ({
                    value: sitio.id.toString(),
                    label: sitio.zona?.locality || "Sin localidad",
                    subtitle: `Lat: ${sitio.latitude}, Lon: ${sitio.longitude}${sitio.event ? ` (${sitio.event.type})` : ""}`,
                    icon: <MapPin className="w-4 h-4" />
                  }))}
                  value={formData.site_id}
                  onChange={(value) => handleChange({ target: { id: "site_id", value } })}
                  placeholder="Seleccione un sitio"
                  icon={<Locate className="w-5 h-5" />}
                />
                
                {/* Sección auxiliar - Crear sitio */}
                <div className="mt-12">
                  <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-50/80 to-green-50/80 border border-emerald-200/50 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <p className="text-xs text-slate-700 font-medium">
                          ¿No encuentras el sitio?
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={go.sites.add}
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm hover:shadow-md transform hover:scale-105 whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Crear Sitio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg backdrop-blur-sm transform hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              Agregar Usuario
            </button>
          </div>
        </div>
      </div>

      <Toast
        isOpen={toastOpen}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </DashboardLayout>
  );
};

export default FormAddUser;