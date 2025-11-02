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

interface TopZonasPorRegistroProps {
  data: Array<{ locality: string; cantidad_registros: number }>;
}

const TopZonasPorRegistro = ({ data }: TopZonasPorRegistroProps) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" stroke="#64748b" />
        <YAxis type="category" dataKey="locality" stroke="#64748b" width={150} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
          formatter={(value: number) => [`${value} reportes`, 'Cantidad']}
        />
        <Bar dataKey="cantidad_registros" fill="#10b981" radius={[0, 8, 8, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopZonasPorRegistro;
