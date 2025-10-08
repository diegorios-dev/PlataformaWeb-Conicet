import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";
import {
  User,
  KeyRound,
  Shield,
  MapPinCheckIcon,
  Save,
  X
} from "lucide-react";

const inputClass =
  "border border-gray-200 bg-white rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 placeholder-gray-400 transition shadow-sm flex items-center gap-2";

const buttonClass =
  "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition shadow hover:shadow-lg";

const FormEditUser = ({
  selectedUser,
  setSelectedUser,
  setShowEditModal,
  saveUser
}) => {
  const { goBack } = useNavegation();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-200 bg-opacity-80 backdrop-blur-sm"></div>
      <div className="absolute top-8 left-8 z-10">
      <BackButton />
      </div>
      <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
      <div className="flex justify-center items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center flex-1 tracking-tight">
        Editar Usuario
        </h2>
      </div>
      <div className="space-y-5">
        <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <User className="text-blue-600" size={20} />
          <input
          type="text"
          className={inputClass}
          placeholder="Nombre"
          value={selectedUser?.name || ""}
          onChange={e =>
            setSelectedUser({ ...selectedUser, name: e.target.value })
          }
          />
        </div>
        <span className="text-xs italic text-gray-400 ml-10">Nombre </span>
        </div>
        <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" size={20} />
          <input
          type="text"
          className={inputClass}
          placeholder="Rol"
          value={selectedUser?.rol || ""}
          onChange={e =>
            setSelectedUser({ ...selectedUser, rol: e.target.value })
          }
          />
        </div>
        <span className="text-xs italic text-gray-400 ml-10">Rol: (Admin, Usuario)</span>
        </div>
        <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <KeyRound className="text-blue-600" size={20} />
          <input
          type="text"
          className={inputClass}
          placeholder="Contraseña"
          value={selectedUser?.password || ""}
          onChange={e =>
            setSelectedUser({ ...selectedUser, password: e.target.value })
          }
          />
        </div>
        <span className="text-xs italic text-gray-400 ml-10">Contraseña</span>
        </div>
        {/* Coordenadas */}
        <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPinCheckIcon className="text-blue-600" size={20} />
          <span className="font-semibold text-gray-800">Coordenadas</span>
        </div>
        <div className="flex flex-col gap-3 ml-8 md:flex-row">
          <div className="flex flex-col gap-1 flex-1">
          <input
            type="text"
            className={inputClass}
            placeholder="Latitud"
            value={selectedUser?.site.latitude || ""}
            onChange={e =>
            setSelectedUser({
              ...selectedUser,
              site: {
              ...selectedUser.site,
              latitude: e.target.value
              }
            })
            }
          />
          <span className="text-xs italic text-gray-400 ml-4">Latitud</span>
          </div>
          <div className="flex flex-col gap-1 flex-1">
          <input
            type="text"
            className={inputClass}
            placeholder="Longitud"
            value={selectedUser?.site.longitude || ""}
            onChange={e =>
            setSelectedUser({
              ...selectedUser,
              site: {
              ...selectedUser.site,
              longitude: e.target.value
              }
            })
            }
          />
          <span className="text-xs italic text-gray-400 ml-4">Longitud</span>
          </div>
        </div>
        </div>
        <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <MapPinCheckIcon className="text-blue-600" size={20} />
          <input
          type="text"
          className={inputClass}
          placeholder="Localidad"
          value={selectedUser?.zona.locality || ""}
          onChange={e =>
            setSelectedUser({
            ...selectedUser,
            zona: {
              ...selectedUser.zona,
              locality: e.target.value
            }
            })
          }
          />
        </div>
        <span className="text-xs italic text-gray-400 ml-10">Localidad</span>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <button
        onClick={() => setShowEditModal(false)}
        className={`${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}
        >
        <X size={18} />
        Cancelar
        </button>
        <button
        onClick={() => saveUser(selectedUser)}
        className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
        >
        <Save size={18} />
        Guardar
        </button>
      </div>
      </div>
    </div>
  );
};

export default FormEditUser;