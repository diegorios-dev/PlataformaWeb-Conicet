import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { mes: "Enero", caudal: 120 },
  { mes: "Febrero", caudal: 180 },
  { mes: "Marzo", caudal: 90 },
];

const HistogramaCaudalimetro = () => {
  return (
    <div style={{ width: "80%", margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>Histograma de Caudalímetro</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="mes" />
          <YAxis label={{ value: "L/s", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="caudal" fill="#0288D1" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HistogramaCaudalimetro;
