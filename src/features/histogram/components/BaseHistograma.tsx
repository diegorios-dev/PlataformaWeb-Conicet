import { useState } from "react";
import { useHistograma } from "./hooks/useHistograma";
import { generatePDF} from "../service/generatePDF";

import HistogramaHeader from "./HistogramaHeader";
import HistogramaControls from "./HistogramaControls";
import HistogramaChart from "./HistogramaChart";
import HistogramaEmpty from "./HistogramaEmpty";
import HistogramaError from "./HistogramaError";
import HistogramaLoading from "./HistogramaLoading";
import NavMenu from "@/shared/ui/layouts/NavMenu";
import BackButton from "@shared/ui/buttons/BackButton";
import { useNavegation } from "@shared/hooks";
import { months } from "../contants/constants";

interface BaseHistogramaProps {
  title: string;
  service: Parameters<typeof useHistograma>[0];
  unidad: string;
  color: string;
  filenamePrefix: string;
}

export default function BaseHistograma({ title, service, unidad, color, filenamePrefix }: BaseHistogramaProps) {
  const h = useHistograma(service);
  const { go } = useNavegation();
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  const handleGeneratePDF = async () => {
    try {
      setGenerandoPDF(true);
      setPdfProgress(0);

      // Simular progreso
      setPdfProgress(30);
      
      await generatePDF({
        title,
        periodo: h.periodo,
        year: h.year,
        month: h.month,
        data: h.data,
        chartRef: h.chartRef,
        filenamePrefix,
        pdfQuality: h.pdfQuality
      });
      
      setPdfProgress(100);
      
      // Resetear después de un breve delay
      setTimeout(() => {
        setGenerandoPDF(false);
        setPdfProgress(0);
      }, 1000);
    } catch (error) {
      setGenerandoPDF(false);
      setPdfProgress(0);
    }
  };

  // Obtener el nombre del mes para EmptyState
  const monthName = h.month ? months.find(m => m.value === h.month)?.label : undefined;

  return (
      <div className="w-full max-w-7xl mx-auto mt-10">

      <NavMenu />
      
      <BackButton className="m-8" onClick={go.histograma.list}  />
      
      <HistogramaHeader title={title} unidad={unidad} />

      <HistogramaControls
        {...h}
        generandoPDF={generandoPDF}
        pdfProgress={pdfProgress}
        onGeneratePDF={handleGeneratePDF}
      />

      {h.loading && <HistogramaLoading />}
      {Boolean(h.error) && (
        <HistogramaError
          error={h.error instanceof Error ? h.error.message : String(h.error)}
          onRetry={() => window.location.reload()}
        />
      )}
      {!h.loading && !h.error && h.data?.length === 0 && (
        <HistogramaEmpty 
          periodo={h.periodo}
          year={h.year}
          month={monthName}
        />
      )}

      {!h.loading && !h.error && h.data?.length > 0 && (
        <HistogramaChart
          data={h.data}
          color={color}
          unidad={unidad}
          chartRef={h.chartRef}
        />
      )}
    </div>
  );
}