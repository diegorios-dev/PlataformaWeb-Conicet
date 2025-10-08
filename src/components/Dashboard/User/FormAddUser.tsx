import { useState } from "react";
import { postNewUser } from "../../../services/userService";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";
import {
  User,
  Plus,
  Shield,
  MapPin,
  Locate,
  CloudRain,
  Snowflake
} from "lucide-react";

const FormAddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    rol: "",
    zona: { locality: "" },
    site: { latitude: "", longitude: "" },
    precipitation: { type: "" }
  });
  const { goBack } = useNavegation();
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "zone") {
      setFormData((prev) => ({
        ...prev,
        zona: { ...prev.zona, locality: value },
      }));
    } else if (id === "site-x") {
      setFormData((prev) => ({
        ...prev,
        site: { ...prev.site, latitude: value },
      }));
    } else if (id === "site-y") {
      setFormData((prev) => ({
        ...prev,
        site: { ...prev.site, longitude: value },
      }));
    } else if (id === "precipitation") {
      setFormData((prev) => ({
        ...prev,
        precipitation: { ...prev.precipitation, type: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos a enviar:", formData);
    await postNewUser(formData);
  };

  return (
    <div>
      <div className="p-8">
        <BackButton />
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
          <User className="w-7 h-7 text-blue-500" />
          Agregar Usuario
        </h1>
        <form
          className="bg-white shadow-xl rounded-3xl px-10 pt-8 pb-10 border border-gray-100"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div>
              {/* Nombre */}
              <div className="mb-6">
                <label
                  className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2"
                  htmlFor="name"
                >
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>
              {/* Password */}
              <div className="mb-6">
                <label
                  className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Ingrese la contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>
              {/* Rol */}
              <div className="mb-6">
                <label
                  className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2"
                  htmlFor="rol"
                >
                  <Shield className="w-5 h-5 text-blue-400" />
                  Rol
                </label>
                <input
                  id="rol"
                  type="text"
                  placeholder="Ingrese el rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>
            </div>
            {/* Columna 2 */}
            <div>
              {/* Zona */}
              <div className="mb-6">
                <label
                  className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2"
                  htmlFor="zone"
                >
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Zona
                </label>
                <select
                  id="zone"
                  value={formData.zona.locality}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                  <option value="">Seleccione una zona</option>
                  <option value="Bariloche">Bariloche</option>
                  <option value="Esquel">Esquel</option>
                  <option value="Río Gallegos">Río Gallegos</option>
                  <option value="Ushuaia">Ushuaia</option>
                  <option value="El Calafate">El Calafate</option>
                  <option value="San Martín de los Andes">San Martín de los Andes</option>
                  <option value="Viedma">Viedma</option>
                  <option value="Trelew">Trelew</option>
                  <option value="Puerto Madryn">Puerto Madryn</option>
                  <option value="Comodoro Rivadavia">Comodoro Rivadavia</option>
                </select>
              </div>
              {/* Sitio */}
              <div className="mb-6">
                <label
                  className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2"
                  htmlFor="site-x"
                >
                  <Locate className="w-5 h-5 text-blue-400" />
                  Sitio (Coordenadas)
                </label>
                <div className="flex gap-3">
                  <input
                    id="site-x"
                    type="text"
                    placeholder="Coordenada X"
                    value={formData.site.latitude}
                    onChange={handleChange}
                    className="w-1/2 py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                  <input
                    id="site-y"
                    type="text"
                    placeholder="Coordenada Y"
                    value={formData.site.longitude}
                    onChange={handleChange}
                    className="w-1/2 py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>
              {/* Herramienta */}
              <div className="mb-6">
                <label
                  className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2"
                  htmlFor="herramienta"
                >
                  {formData.precipitation.type === "Nieve" ? (
                    <Snowflake className="w-5 h-5 text-blue-400" />
                  ) : formData.precipitation.type === "Lluvia" ? (
                    <CloudRain className="w-5 h-5 text-blue-400" />
                  ) : (
                    <CloudRain className="w-5 h-5 text-blue-400" />
                  )}
                  Herramienta
                </label>
                <select
                  id="precipitation"
                  value={formData.precipitation.type || ""}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                  <option value="">Seleccione una herramienta</option>
                  <option value="Nieve">Nieve</option>
                  <option value="Lluvia">Lluvia</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddUser;
