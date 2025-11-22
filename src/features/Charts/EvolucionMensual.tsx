import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EvolucionMensualProps {
  data: Array<{ periodo: string; lluvia: number; nieve: number; caudal: number }>;
}

const EvolucionMensual = ({ data }: EvolucionMensualProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="periodo" 
          stroke="#64748b"
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
          formatter={(value: number) => `${value.toFixed(2)} mm`}
        />
        <Legend />
        <Bar dataKey="lluvia" fill="#f97316" radius={[4, 4, 0, 0]} name="Lluvia" />
        <Line type="monotone" dataKey="nieve" stroke="#3b82f6" strokeWidth={2} name="Nieve" />
        <Area type="monotone" dataKey="caudal" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.3} name="Caudal" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default EvolucionMensual;
