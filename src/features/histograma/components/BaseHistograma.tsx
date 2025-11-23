import { useHistograma } from "./hooks/useHistograma";
import { generatePDF} from "../service/generatePDF";

import HistogramaHeader from "./HistogramaHeader";
import HistogramaControls from "./HistogramaControls";
import HistogramaChart from "./HistogramaChart";
import HistogramaEmpty from "./HistogramaEmpty";
import HistogramaError from "./HistogramaError";
import HistogramaLoading from "./HistogramaLoading";
import NavMenu from "@/shared/ui/layouts/navMenu";

export default function BaseHistograma({ title, service, unidad, color, filenamePrefix }) {
  const h = useHistograma(service);

  return (
      <div className="w-full max-w-7xl mx-auto mt-10">

      <NavMenu />
      
      <HistogramaHeader title={title} unidad={unidad} />

      <HistogramaControls
        {...h}
        onGeneratePDF={() =>
          generatePDF({
            title,
            periodo: h.periodo,
            year: h.year,
            month: h.month,
            data: h.data,
            chartRef: h.chartRef,
            filenamePrefix,
            pdfQuality: h.pdfQuality
          })
        }
      />

      {h.loading && <HistogramaLoading />}
      {h.error && <HistogramaError error={h.error} />}
      {!h.loading && !h.error && h.data?.length === 0 && <HistogramaEmpty />}

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
