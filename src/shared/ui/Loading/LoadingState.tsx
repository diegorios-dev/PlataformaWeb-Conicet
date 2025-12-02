import { Loader2, MapPin, BarChart3, FileText, Database, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";


/**
 * Spinner de carga genérico
 * Usa animación de spin suave con mensaje personalizable
 */
interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  submessage?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ 
  message = "Cargando...", 
  size = "md",
  submessage,
  fullScreen = true
}: LoadingSpinnerProps) => {

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const containerClass = fullScreen 
    ? "flex items-center justify-center min-h-screen w-full"
    : "flex items-center justify-center w-full py-20";

  return (
    <div className={containerClass}>
      <div className="text-center p-10">
        <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin mx-auto mb-4`} />
        <p className="text-slate-700 font-semibold text-lg mb-1">{message}</p>
        {submessage && (
          <p className="text-slate-500 text-sm">{submessage}</p>
        )}
      </div>
    </div>
  );
};


/**
 * Spinner de carga genérico
 * Usa animación de spin suave con mensaje personalizable
 */
interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  submessage?: string;
  fullScreen?: boolean;
}

export const LoadingMapConicet = ({ 
  message,
  size = "md",
  fullScreen = true,
}: LoadingSpinnerProps) => {

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const containerClass = fullScreen 
    ? "flex items-center justify-center min-h-screen w-full relative"
    : "flex items-center justify-center w-full py-20 relative";

  return (
    <div className={containerClass}>
      {/* Imagen de fondo */}
      <img 
        src="../../../public/assets/conicetMapa.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* overlay muy leve */}
      <div className="absolute inset-0 bg-white/30 pointer-events-none"></div>
      {/* Contenido */}
      <div className="text-center p-10 relative z-10">
        <p className="text-white italic text-7xl mb-1 font-light">{message}</p>
        <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin mx-auto mb-4`} />
      </div>
    </div>
  );
};

/**
 * Loading específico para mapas
 * Animación personalizada con contador de sitios
 */
interface LoadingMapProps {
  siteCount?: number;
  message?: string;
}

export const LoadingMap = ({ siteCount = 0, message = "Cargando sitios..." }: LoadingMapProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center p-10">
        {/* Animación de mapa cargando */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </div>
        </div>
        
        <p className="text-xl font-semibold text-slate-700 mb-2">
          {message}
        </p>
        {siteCount > 0 && (
          <p className="text-sm text-slate-500">
            {siteCount} {siteCount === 1 ? 'sitio encontrado' : 'sitios encontrados'}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Estado vacío genérico
 * Muestra un ícono, título y descripción cuando no hay datos
 */
interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  suggestion?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title = "No hay datos disponibles", 
  description = "No se encontraron resultados",
  suggestion,
  action,
  className = ""
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] py-20 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl ${className}`}>
      <div className="bg-slate-100 rounded-full p-6 mb-4 shadow-lg shadow-slate-500/10">
        {Icon ? (
          <Icon className="w-10 h-10 text-slate-400" />
        ) : (
          <svg 
            className="w-10 h-10 text-slate-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2 text-center px-4">{title}</h3>
      <p className="text-base text-slate-500 text-center mb-4 px-4">{description}</p>
      
      {suggestion && (
        <div className="text-sm text-slate-600 bg-blue-50/80 backdrop-blur-sm rounded-xl p-4 max-w-md mx-4 border border-blue-200/50">
          <span className="font-semibold"> <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline-block" /> Sugerencia:</span> {suggestion}
        </div>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

/**
 * Estado vacío específico para mapas sin datos
 */
export const EmptyMapState = ({ 
  instrumentName,
  onChangeInstrument
}: { 
  instrumentName?: string;
  onChangeInstrument?: () => void;
}) => {
  return (
    <EmptyState
      icon={MapPin}
      title="No hay sitios disponibles"
      description={`No se encontraron sitios con datos${instrumentName ? ` para ${instrumentName}` : ''}.`}
      suggestion="Intenta seleccionar otro instrumento o tipo de evento desde el menú lateral."
      action={onChangeInstrument ? {
        label: "Cambiar filtros",
        onClick: onChangeInstrument
      } : undefined}
    />
  );
};

/**
 * Estado vacío específico para histogramas sin datos
 */
export const EmptyHistogramState = ({
  periodo,
  year,
  month
}: {
  periodo?: string;
  year?: number;
  month?: string;
}) => {
  let timeDescription = "el período seleccionado";
  if (periodo === "dia" && month && year) {
    timeDescription = `${month} de ${year}`;
  } else if (periodo === "mes" && year) {
    timeDescription = `el año ${year}`;
  } else if (periodo === "año") {
    timeDescription = "todos los años";
  }

  return (
    <EmptyState
      icon={BarChart3}
      title="Sin registros para mostrar"
      description={`No hay datos disponibles para ${timeDescription}.`}
      suggestion="Intenta seleccionar otro período o verifica que existan reportes cargados en el sistema."
    />
  );
};

/**
 * Estado vacío para tablas sin resultados
 */
export const EmptyTableState = ({
  searchTerm,
  onClearFilters
}: {
  searchTerm?: string;
  onClearFilters?: () => void;
}) => {
  return (
    <EmptyState
      icon={FileText}
      title={searchTerm ? "Sin resultados" : "No hay registros"}
      description={
        searchTerm 
          ? `No se encontraron resultados para "${searchTerm}"`
          : "Aún no hay registros en esta tabla."
      }
      suggestion={searchTerm ? "Intenta con otros términos de búsqueda o limpia los filtros." : undefined}
      action={onClearFilters && searchTerm ? {
        label: "Limpiar filtros",
        onClick: onClearFilters
      } : undefined}
    />
  );
};

/**
 * Estado vacío para listas de reportes
 */
export const EmptyReportsState = ({
  hasFilters,
  onClearFilters
}: {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}) => {
  return (
    <EmptyState
      icon={Database}
      title={hasFilters ? "Sin resultados" : "No hay reportes"}
      description={
        hasFilters
          ? "No se encontraron reportes que coincidan con los filtros aplicados."
          : "Aún no hay reportes registrados en el sistema."
      }
      suggestion={hasFilters ? "Intenta modificar o limpiar los filtros aplicados." : "Comienza agregando un nuevo reporte."}
      action={hasFilters && onClearFilters ? {
        label: "Limpiar filtros",
        onClick: onClearFilters
      } : undefined}
    />
  );
};
