import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export const PaginationControls = ({
  currentPage,
  lastPage,
  total,
  perPage,
  from,
  to,
  onPageChange,
  onPerPageChange,
}: PaginationControlsProps) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (lastPage <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < lastPage - 2) {
        pages.push('...');
      }
      
      // Show last page
      pages.push(lastPage);
    }
    
    return pages;
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-900/5 p-4 md:p-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Info de resultados */}
        <div className="text-sm text-slate-600">
          Mostrando <span className="font-semibold text-slate-900">{from}</span> a{" "}
          <span className="font-semibold text-slate-900">{to}</span> de{" "}
          <span className="font-semibold text-slate-900">{total}</span> reportes
        </div>

        {/* Controles de paginación */}
        <div className="flex items-center gap-2">
          {/* Primera página */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            title="Primera página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Página anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            title="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Números de página */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400">
                    ...
                  </span>
                );
              }
              
              const pageNum = page as number;
              const isActive = pageNum === currentPage;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[40px] px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Página actual en móvil */}
          <div className="sm:hidden px-3 py-2 text-sm font-medium text-slate-700">
            Página {currentPage} de {lastPage}
          </div>

          {/* Página siguiente */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            title="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Última página */}
          <button
            onClick={() => onPageChange(lastPage)}
            disabled={currentPage === lastPage}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            title="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de items por página */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 whitespace-nowrap">
            Por página:
          </label>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};
