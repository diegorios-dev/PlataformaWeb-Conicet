import { AlertTriangle, WifiOff, ServerCrash, Clock, RefreshCw, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Tipos de error de red específicos
 */
export type NetworkErrorType = 
  | "timeout"
  | "offline" 
  | "server_error"
  | "not_found"
  | "unauthorized"
  | "forbidden"
  | "bad_request"
  | "unknown";

interface NetworkErrorDetails {
  type: NetworkErrorType;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

/**
 * Mapeo de tipos de error a detalles visuales
 */
const ERROR_DETAILS: Record<NetworkErrorType, NetworkErrorDetails> = {
  timeout: {
    type: "timeout",
    icon: Clock,
    title: "Tiempo de espera agotado",
    description: "El servidor tardó demasiado en responder. Verifica tu conexión e intenta nuevamente.",
    color: "orange"
  },
  offline: {
    type: "offline",
    icon: WifiOff,
    title: "Sin conexión a Internet",
    description: "No se pudo conectar con el servidor. Verifica tu conexión a Internet.",
    color: "red"
  },
  server_error: {
    type: "server_error",
    icon: ServerCrash,
    title: "Error del servidor (500)",
    description: "El servidor encontró un problema al procesar tu solicitud. Intenta más tarde.",
    color: "red"
  },
  not_found: {
    type: "not_found",
    icon: AlertCircle,
    title: "Recurso no encontrado (404)",
    description: "No se pudo encontrar el recurso solicitado en el servidor.",
    color: "yellow"
  },
  unauthorized: {
    type: "unauthorized",
    icon: AlertTriangle,
    title: "No autorizado (401)",
    description: "Tu sesión expiró o no tienes permisos. Inicia sesión nuevamente.",
    color: "amber"
  },
  forbidden: {
    type: "forbidden",
    icon: AlertTriangle,
    title: "Acceso denegado (403)",
    description: "No tienes permisos para acceder a este recurso.",
    color: "red"
  },
  bad_request: {
    type: "bad_request",
    icon: AlertCircle,
    title: "Solicitud incorrecta (400)",
    description: "Los datos enviados son incorrectos o están incompletos.",
    color: "yellow"
  },
  unknown: {
    type: "unknown",
    icon: AlertTriangle,
    title: "Error desconocido",
    description: "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
    color: "slate"
  }
};

/**
 * Detecta el tipo de error basado en el código de estado HTTP o error
 */
export function detectErrorType(error: any): NetworkErrorType {
  // Sin conexión
  if (!navigator.onLine) {
    return "offline";
  }

  // Timeout
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    return "timeout";
  }

  // Errores HTTP basados en status
  const status = error?.response?.status || error?.status;
  
  if (status === 400) return "bad_request";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status >= 500) return "server_error";

  // Error de red genérico
  if (error?.message?.includes("Network Error") || error?.message?.includes("Fallo algo , intentelo mas tarde")) {
    return "offline";
  }

  return "unknown";
}

/**
 * Props del componente ErrorState
 */
interface ErrorStateProps {
  error?: any;
  errorType?: NetworkErrorType;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Componente de estado de error con diseño mejorado
 */
export const ErrorState = ({
  error,
  errorType,
  title,
  description,
  onRetry,
  retryLabel = "Reintentar",
  className = ""
}: ErrorStateProps) => {
  
  // Detectar tipo de error si no se especifica
  const detectedType = errorType || detectErrorType(error);
  const errorDetails = ERROR_DETAILS[detectedType];

  const Icon = errorDetails.icon;
  
  const colorClasses = {
    red: "bg-red-100 text-red-600 border-red-200",
    orange: "bg-orange-100 text-orange-600 border-orange-200",
    yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200"
  };

  const buttonColorClasses = {
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    orange: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
    yellow: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    amber: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    slate: "bg-slate-600 hover:bg-slate-700 focus:ring-slate-500"
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] py-20 ${className}`}>
      <div className={`${colorClasses[errorDetails.color]} rounded-full p-6 mb-6 border-2 shadow-lg`}>
        <Icon className="w-12 h-12" />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 mb-3 text-center px-4">
        {title || errorDetails.title}
      </h3>
      
      <p className="text-base text-slate-600 mb-6 text-center max-w-md px-4">
        {description || errorDetails.description}
      </p>

      {/* Detalles técnicos (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && error?.message && (
        <details className="mb-6 w-full max-w-md px-4">
          <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700 font-medium">
            Detalles técnicos
          </summary>
          <pre className="mt-2 p-3 bg-slate-100 rounded-lg text-xs text-slate-700 overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      {/* Botón de reintentar */}
      {onRetry && (
        <button
          onClick={onRetry}
          className={`${buttonColorClasses[errorDetails.color]} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50`}
        >
          <RefreshCw className="w-5 h-5" />
          {retryLabel}
        </button>
      )}
    </div>
  );
};

/**
 * Hook para manejar estados de error de manera consistente
 */
export function useErrorHandler() {
  const handleError = (error: any): NetworkErrorType => {
    const errorType = detectErrorType(error);
    console.error(`[${errorType}]`, error);
    return errorType;
  };

  return { handleError };
}
