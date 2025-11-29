import { User, Shield, UserCog } from "lucide-react";
import type { UserType } from "../../types";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

interface UserBasicInfoFormProps {
  user: UserType;
  onUserChange: (user: UserType) => void;
  disabled?: boolean;
}

export const UserBasicInfoForm = ({
  user,
  onUserChange,
  disabled = false
}: UserBasicInfoFormProps) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-4 border border-blue-50">
      <div className="flex items-center gap-2 mb-3">
        <User className="text-blue-600" size={16} />
        <h3 className="font-semibold  text-base">Información Personal</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="font-semibold text-xs mb-1 block text-gray-600">
            Nombre completo
          </label>
          <input
            className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-sans text-sm"
            value={user.name}
            onChange={(e) => onUserChange({ ...user, name: e.target.value })}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="font-semibold text-xs mb-1 block text-gray-600">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-sans text-sm"
            placeholder="Dejar vacío para no cambiar"
            value={user.password || ""}
            onChange={(e) => onUserChange({ ...user, password: e.target.value })}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="font-semibold text-xs mb-1 block text-gray-600">
            Rol
          </label>
          <CustomSelect
            options={[
              { value: "admin", label: "Administrador", icon: <Shield className="w-4 h-4" /> },
              { value: "user", label: "Usuario", icon: <UserCog className="w-4 h-4" /> }
            ]}
            value={user.rol}
            onChange={(value) => onUserChange({ ...user, rol: String(value) })}
            placeholder="Seleccionar rol"
            icon={<Shield className="w-5 h-5" />}
            disabled={disabled}
          />
        </div>
      </div>
    </section>
  );
};
