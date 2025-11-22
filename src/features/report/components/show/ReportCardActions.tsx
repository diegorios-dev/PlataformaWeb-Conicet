import { Pencil } from "lucide-react";

interface ReportCardActionsProps {
  type: string;
  onClick: () => void;
}

export const ReportCardActions = ({ type, onClick }: ReportCardActionsProps) => {
  return (
    <button
      className={`w-full font-bold py-4 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-101 group/btn text-base ${
        type === "rotura"
          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-600/30"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/30"
      }`}
      onClick={onClick}
    >
      <Pencil size={20} className="transition-transform group-hover/btn:rotate-12" />
      {type === "rotura" ? "Resolver Rotura" : "Editar Reporte"}
    </button>
  );
};