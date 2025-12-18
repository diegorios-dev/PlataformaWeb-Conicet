import { EmptyHistogramState } from "@shared/ui/Loading/LoadingState";

interface HistogramaEmptyProps {
  periodo?: string;
  year?: number;
  month?: string;
}

export default function HistogramaEmpty({ periodo, year, month }: HistogramaEmptyProps) {
  return (
    <div className="mt-4">
      <EmptyHistogramState
        periodo={periodo}
        year={year}
        month={month}
      />
    </div>
  );
}
