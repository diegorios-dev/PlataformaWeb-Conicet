import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { mes: "Enero", nieve: 10 },
  { mes: "Febrero", nieve: 25 },
  { mes: "Marzo", nieve: 5 },
];

const  HistogramaNieve = () => {
  return (
    <div style={{ width: "80%", margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>Histograma de Nieve</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="mes" />
          <YAxis label={{ value: "cm", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="nieve" fill="#81D4FA" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HistogramaNieve;
