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

// Paleta de colores: el primero (naranja) es para el valor más alto
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

interface PrecipitacionPorZonaProps {
  data: Array<{ zona: string; precipitacion: number }>;
}

const PrecipitacionPorZona = ({ data }: PrecipitacionPorZonaProps) => {
  // Filtrar solo zonas con precipitación mayor a 0 y ordenar de mayor a menor
  const dataFiltrada = data
    .filter(item => item.precipitacion > 0)
    .sort((a, b) => b.precipitacion - a.precipitacion);
  
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
        <Bar dataKey="precipitacion" radius={[8, 8, 0, 0]}>
          {dataFiltrada.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PrecipitacionPorZona;
