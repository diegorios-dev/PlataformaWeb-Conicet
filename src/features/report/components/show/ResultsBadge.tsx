interface ResultsBadgeProps {
  count: number;
}

export const ResultsBadge = ({ count }: ResultsBadgeProps) => {
  return (
    <div className="mt-7 pt-6 border-t border-slate-100">
      <div className="inline-flex items-center gap-3 text-[15px] font-semibold text-slate-800 
                    bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 rounded-[14px] 
                    shadow-sm border border-blue-100/50 transition-all duration-300 hover:shadow-md">
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          <span className="absolute w-2 h-2 bg-blue-600 rounded-full animate-ping opacity-75"></span>
        </div>
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
          {count}
        </span>
        <span className="text-slate-600 font-medium">
          {count === 1 ? "reporte encontrado" : "reportes encontrados"}
        </span>
      </div>
    </div>
  );
};