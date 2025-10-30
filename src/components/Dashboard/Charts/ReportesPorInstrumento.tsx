import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#f97316", // naranja para el máximo
  "#3b82f6", // azul
  "#8b5cf6", // púrpura
  "#06b6d4", // cyan
  "#10b981", // verde
  "#ec4899", // rosa
  "#6366f1", // índigo
  "#eab308", // amarillo
];

interface ReportesPorInstrumentoProps {
  data: Array<{ instrumento: string; cantidad_mediciones: number }>;
}

const ReportesPorInstrumento = ({ data }: ReportesPorInstrumentoProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="instrumento" 
          stroke="#64748b"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
        />
        <Bar dataKey="cantidad_mediciones" radius={[8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReportesPorInstrumento;
