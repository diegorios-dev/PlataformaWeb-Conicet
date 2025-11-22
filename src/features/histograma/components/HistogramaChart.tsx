import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function HistogramaChart({ data, color, unidad, chartRef }) {
  return (
    <div className="bg-white/85 backdrop-blur-md border border-white/70 rounded-2xl p-4 shadow-lg">
      <div ref={chartRef} className="bg-white rounded-xl p-2">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data}>
            <XAxis dataKey="label" />
            <YAxis label={{ value: unidad, angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
