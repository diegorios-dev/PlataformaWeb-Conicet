import BaseHistograma from "./BaseHistograma";
import { getHistogramaCaudal } from '../../services/reportService';

export default function HistogramaCaudalimetro() {
  return (
    <BaseHistograma
      title="Histograma de Caudalímetro"
      service={getHistogramaCaudal}
      unidad="L/s"
      color="#0288D1"
      filenamePrefix="histograma-caudalimetro"
    />
  );
}
