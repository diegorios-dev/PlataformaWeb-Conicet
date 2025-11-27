import { ErrorState } from "@shared/ui/Loading/ErrorState";

interface HistogramaErrorProps {
  error: any;
  onRetry?: () => void;
}

export default function HistogramaError({ error, onRetry }: HistogramaErrorProps) {
  return (
    <div className="mt-4">
      <ErrorState 
        error={error}
        onRetry={onRetry}
        retryLabel="Reintentar carga"
        className="min-h-[300px]"
      />
    </div>
  );
}
