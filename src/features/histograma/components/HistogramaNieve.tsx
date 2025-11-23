import BaseHistograma from "./BaseHistograma";
import { getHistogramaNieve } from '@features/report/services';

export default function HistogramaNieve() {
  return (
    <BaseHistograma
      title="Histograma de Nieve"
      service={getHistogramaNieve}
      unidad="cm"
      color="#81D4FA"
      filenamePrefix="histograma-nieve"
    />
  );
}
