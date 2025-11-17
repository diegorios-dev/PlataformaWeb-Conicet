import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, Droplet, Snowflake, Waves } from "lucide-react";

type MesData = {
  mes: number;
  mes_nombre: string;
  cantidad_eventos: number;
  eventos_lluvia: number;
  eventos_nieve: number;
  eventos_caudal: number;
};

interface PatronMensualProps {
  data: MesData[];
}

const PatronMensual = ({ data }: PatronMensualProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[320px] text-slate-500">
        No hay datos disponibles para el patrón mensual
      </div>
    );
  }

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="backdrop-blur-xl bg-white/95 border-2 border-orange-200 rounded-2xl shadow-2xl p-4 min-w-[220px]">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-orange-100">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
          <h3 className="font-bold text-slate-800 text-base">{data.mes_nombre}</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600 text-sm font-medium flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              Total eventos:
            </span>
            <span className="font-bold text-orange-700 text-sm">{data.cantidad_eventos}</span>
          </div>
          
          {data.eventos_lluvia > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 text-xs flex items-center gap-1">
                <Droplet className="w-3 h-3 text-blue-600" />
                Lluvia:
              </span>
              <span className="font-semibold text-blue-600 text-xs">{data.eventos_lluvia}</span>
            </div>
          )}
          
          {data.eventos_nieve > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 text-xs flex items-center gap-1">
                <Snowflake className="w-3 h-3 text-cyan-600" />
                Nieve:
              </span>
              <span className="font-semibold text-cyan-600 text-xs">{data.eventos_nieve}</span>
            </div>
          )}
          
          {data.eventos_caudal > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-600 text-xs flex items-center gap-1">
                <Waves className="w-3 h-3 text-teal-600" />
                Caudal:
              </span>
              <span className="font-semibold text-teal-600 text-xs">{data.eventos_caudal}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
        <PolarAngleAxis 
          dataKey="mes_nombre" 
          stroke="#64748b"
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          stroke="#64748b"
          tick={{ fill: '#64748b', fontSize: 11 }}
        />
        <Radar
          name="Eventos totales"
          dataKey="cantidad_eventos"
          stroke="#f97316"
          fill="#f97316"
          fillOpacity={0.6}
          strokeWidth={2}
          label={{ fill: '#f97316', fontSize: 11, fontWeight: 'bold' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          iconType="circle"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PatronMensual;
