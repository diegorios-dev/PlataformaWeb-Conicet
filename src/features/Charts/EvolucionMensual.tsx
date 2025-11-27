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
  // Calcular totales para descripción accesible
  const totales = data.reduce(
    (acc, item) => ({
      lluvia: acc.lluvia + item.lluvia,
      nieve: acc.nieve + item.nieve,
      caudal: acc.caudal + item.caudal,
    }),
    { lluvia: 0, nieve: 0, caudal: 0 }
  );

  return (
    <div role="img" aria-label={`Gráfico de evolución mensual de precipitación. Total lluvia: ${totales.lluvia.toFixed(1)}mm, nieve: ${totales.nieve.toFixed(1)}mm, caudal: ${totales.caudal.toFixed(1)}mm`}>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart 
          data={data}
          accessibilityLayer
        >
          <title>Evolución Mensual de Precipitación</title>
          <desc>
            Gráfico combinado mostrando la evolución temporal de lluvia (barras naranjas), 
            nieve (línea azul) y caudal (área púrpura) a lo largo de {data.length} períodos. 
            Total acumulado - Lluvia: {totales.lluvia.toFixed(1)}mm, Nieve: {totales.nieve.toFixed(1)}mm, 
            Caudal: {totales.caudal.toFixed(1)}mm.
          </desc>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="periodo" 
            stroke="#475569"
            angle={-45}
            textAnchor="end"
            height={80}
            aria-label="Período de tiempo"
          />
          <YAxis 
            stroke="#475569" 
            label={{ value: 'mm', angle: -90, position: 'insideLeft' }}
            aria-label="Precipitación en milímetros"
          />
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
          <Line type="monotone" dataKey="nieve" stroke="#3b82f6" strokeWidth={3} name="Nieve" />
          <Area type="monotone" dataKey="caudal" fill="#8b5cf6" stroke="#8b5cf6" strokeWidth={2} fillOpacity={0.3} name="Caudal" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvolucionMensual;
