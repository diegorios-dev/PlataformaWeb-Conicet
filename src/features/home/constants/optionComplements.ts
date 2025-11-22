import useNavegation from "@hooks/useNavegation";

export const getOptionComplements = (go: ReturnType<typeof useNavegation>["go"]) => [
  { option: "Ver Histograma", onClick: go.histograma.list },
  { option: "Ver Mapa de Calor", onClick: go.heatmap },
];
