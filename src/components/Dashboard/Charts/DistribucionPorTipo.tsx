import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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

interface DistribucionPorTipoProps {
  data: Array<{ tipo_evento: string; cantidad_reportes: number; porcentaje: number }>;
}

const DistribucionPorTipo = ({ data }: DistribucionPorTipoProps) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ tipo_evento, porcentaje }) => `${tipo_evento}: ${porcentaje}%`}
          outerRadius={100}
          dataKey="cantidad_reportes"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
          formatter={(value: number, _name: string, props: any) => [
            `${value} reportes (${props.payload.porcentaje}%)`,
            props.payload.tipo_evento
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DistribucionPorTipo;
