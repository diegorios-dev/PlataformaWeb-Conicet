import { useState } from "react";
import { postNewUser } from "../../../services/userService";
import useNavegation from "../../../hooks/useNavegation";

const FormAddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    rol: "",
    zona: { locality: "" },
    site: { latitude: "", longitude: "" },
    precipitation : { type : ""}
  });
  const { goBack } = useNavegation();
  const handleChange = (e) => {
    const { id, value } = e.target;

    // casos especiales: zona y sitio
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
        precipitation : { ...prev.precipitation, type: value },
      }));
    }else {
      // name, password, rol
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
        <button onClick={goBack}  className="px-6 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-950 transition font-semibold text-base">
          Volver
        </button>
      </div>
    <div className="max-w-md mx-auto mt-8">
     
      <h1 className="text-2xl font-bold mb-6 text-center">Agregar Usuario</h1>

      <form
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8"
        onSubmit={handleSubmit}
      >
        {/* Nombre */}
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
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
            className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
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
            className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Rol */}
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="rol"
          >
            Rol
          </label>
          <input
            id="rol"
            type="text"
            placeholder="Ingrese el rol"
            value={formData.rol}
            onChange={handleChange}
            className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Zona */}
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="zone"
          >
            
          </label>

        <select
            id="zone"
            value={formData.zona.locality}
            onChange={handleChange}
            className="shadow border border-gray-300 rounded w-1/2 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="site-x"
          >
            Sitio (Coordenadas)
          </label>
          <div className="flex gap-2">
            <input
              id="site-x"
              type="text"
              placeholder="Coordenada X"
              value={formData.site.latitude}
              onChange={handleChange}
              className="shadow border border-gray-300 rounded w-1/2 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              id="site-y"
              type="text"
              placeholder="Coordenada Y"
              value={formData.site.longitude}
              onChange={handleChange}
              className="shadow border border-gray-300 rounded w-1/2 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>          
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="herramienta"
          >
            Herramienta
          </label>
          <select
            id="precipitation"
            value={formData.precipitation.type || ""}
            onChange={handleChange}
            className="shadow border border-gray-300 rounded w-full m-2 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccione una herramienta</option>
            <option value="Nieve">Nieve</option>
            <option value="Lluvia">Lluvia</option>
          </select>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Agregar Usuario
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default FormAddUser;
