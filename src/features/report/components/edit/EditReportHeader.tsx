import { Edit3 } from "lucide-react";
import IconNavMenu from "@features/menu/components/IconNavMenu";

export const HeaderEdit = () => {
  return (
    <>
      <IconNavMenu />
      <div className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Editar Reporte</h1>
          </div>
          <div className="w-20" />
        </div>
      </div>
    </>

  );
};