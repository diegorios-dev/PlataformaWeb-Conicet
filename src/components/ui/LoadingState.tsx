import { Loader2, LucideIcon } from "lucide-react";

/**
 * Spinner de carga genérico
 * Usa animación de spin suave con mensaje personalizable
 */
interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ message = "Cargando...", size = "md" }: LoadingSpinnerProps) => {

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="text-center p-10">
        <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin mx-auto mb-4`} />
        <p className="text-slate-600 font-medium">{message}</p>
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
}

export const EmptyState = ({ 
  icon: Icon, 
  title = "No hay datos disponibles", 
  description = "No se encontraron resultados" 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-20 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-3xl">
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
      <h3 className="text-xl font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-base text-slate-500">{description}</p>
    </div>
  );
};
