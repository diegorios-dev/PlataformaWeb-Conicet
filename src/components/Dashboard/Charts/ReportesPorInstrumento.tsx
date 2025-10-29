import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
        <Bar dataKey="cantidad_mediciones" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReportesPorInstrumento;
