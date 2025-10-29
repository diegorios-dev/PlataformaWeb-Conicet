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
  "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#6366f1",
];

interface PrecipitacionPorZonaProps {
  data: Array<{ zona: string; precipitacion: number }>;
}

const PrecipitacionPorZona = ({ data }: PrecipitacionPorZonaProps) => {
  // Filtrar solo zonas con precipitación mayor a 0
  const dataFiltrada = data.filter(item => item.precipitacion > 0);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dataFiltrada}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="zona" 
          stroke="#64748b"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#64748b" label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
        />
        <Bar dataKey="precipitacion" fill="#3b82f6" radius={[8, 8, 0, 0]}>
          {dataFiltrada.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PrecipitacionPorZona;
