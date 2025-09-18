// src/components/DashboardButton.tsx
import type { FC, ReactNode } from "react";

interface DashboardButtonProps {
  label: string;            // Texto del botón
  onClick?: () => void;     // Acción al hacer click
  icon?: ReactNode;         // Ícono opcional
  active?: boolean;         // Si está activo o seleccionado
}

const Button: FC<DashboardButtonProps> = ({ label, onClick, icon, active }) => {

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-lg transition w-full text-left
        ${active ? "bg-blue-600 text-white" : "hover:bg-blue-700 text-gray-200"}`}>

      {icon && <span>{icon}</span>}
      
      <span>{label}</span>
    </button>
  );

};

export default Button;
