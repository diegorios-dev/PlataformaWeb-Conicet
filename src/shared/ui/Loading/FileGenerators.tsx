import { FileDown, Loader2 } from "lucide-react";

interface PDFGeneratorProps {
  isGenerating: boolean;
  onGenerate: () => void;
  disabled?: boolean;
  label?: string;
  progress?: number; // 0-100
}

/**
 * Componente para botón de generación de PDF con indicador de progreso
 */
export const PDFGenerator = ({
  isGenerating,
  onGenerate,
  disabled = false,
  label = "Generar PDF",
  progress
}: PDFGeneratorProps) => {
  return (
    <button
      onClick={onGenerate}
      disabled={disabled || isGenerating}
      className={`relative overflow-hidden px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
        isGenerating
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      }`}
    >
      {/* Barra de progreso */}
      {isGenerating && progress !== undefined && (
        <div 
          className="absolute inset-0 bg-blue-700/30 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="relative flex items-center gap-2">
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generando...</span>
            {progress !== undefined && (
              <span className="text-xs ml-1">({progress}%)</span>
            )}
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5" />
            <span>{label}</span>
          </>
        )}
      </div>
    </button>
  );
};

interface ExcelGeneratorProps {
  isGenerating: boolean;
  onGenerate: () => void;
  disabled?: boolean;
  label?: string;
  type?: "import" | "export";
}

/**
 * Componente para botón de generación de Excel con estado de carga
 */
export const ExcelGenerator = ({
  isGenerating,
  onGenerate,
  disabled = false,
  label,
  type = "export"
}: ExcelGeneratorProps) => {
  const defaultLabel = type === "import" ? "Importar Excel" : "Exportar a Excel";
  
  return (
    <button
      onClick={onGenerate}
      disabled={disabled || isGenerating}
      className={`relative px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
        type === "import"
          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
      }`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{type === "import" ? "Importando..." : "Exportando..."}</span>
        </>
      ) : (
        <>
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <span>{label || defaultLabel}</span>
        </>
      )}
    </button>
  );
};
