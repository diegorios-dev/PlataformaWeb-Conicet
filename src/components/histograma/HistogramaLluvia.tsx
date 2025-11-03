import BaseHistograma from "./BaseHistograma";
import { getHistogramaLluvia } from '../../services/reportService';

export default function HistogramaLluvia() {
  return (
    <BaseHistograma
      title="Histograma de Lluvia"
      service={getHistogramaLluvia}
      unidad="mm"
      color="#3b82f6"
      filenamePrefix="histograma-lluvia"
    />
  );
}
