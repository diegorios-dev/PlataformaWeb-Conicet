import { useNavegation } from "@shared/hooks";

export const getOptionComplements = (go: ReturnType<typeof useNavegation>["go"]) => [
  { option: "Ver Histograma", onClick: go.histograma.list },
  { option: "Ver Mapa de Calor", onClick: go.heatmap },
];
