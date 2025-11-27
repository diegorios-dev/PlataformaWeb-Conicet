import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { BarChart3, Droplet, Snowflake, Waves, Trophy, Star } from "lucide-react";

type RangoData = {
  rango: string;
  rango_inicio: number;
  rango_fin: number;
  frecuencia: number;
  porcentaje: number;
  frecuencia_lluvia?: number;
  frecuencia_nieve?: number;
  frecuencia_caudal?: number;
};

interface AnalisisFrecuenciaProps {
  data: RangoData[];
  estadisticas?: {
    total_mediciones: number;
    valor_minimo: number;
    valor_maximo: number;
    valor_promedio: number;
    rango_mas_frecuente: RangoData;
    unidad_medida: string;
  };
}

const AnalisisFrecuencia = ({ data, estadisticas }: AnalisisFrecuenciaProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-slate-500">
        No hay datos disponibles para el análisis de frecuencia
      </div>
    );
  }

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    const unidad = estadisticas?.unidad_medida || "mm";
    const esRangoMasFrecuente = data.rango === estadisticas?.rango_mas_frecuente?.rango;
    
    const totalFrecuencia = (data.frecuencia_lluvia || 0) + (data.frecuencia_nieve || 0) + (data.frecuencia_caudal || 0);
    
    return (
      <div className="backdrop-blur-xl bg-white/95 border-2 border-blue-200 rounded-2xl shadow-2xl p-4 min-w-[220px]">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-blue-100">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-1">
            {data.rango} {unidad}
            {esRangoMasFrecuente && <Trophy className="w-4 h-4 text-yellow-600" />}
          </h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600 text-sm font-medium flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              Total:
            </span>
            <span className="font-bold text-slate-800 text-sm">{totalFrecuencia}</span>
          </div>
          
          {data.frecuencia_lluvia > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-blue-600 text-xs font-medium flex items-center gap-1">
                <Droplet className="w-3 h-3" />
                Lluvia:
              </span>
              <span className="font-bold text-blue-700 text-xs">{data.frecuencia_lluvia}</span>
            </div>
          )}
          
          {data.frecuencia_nieve > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-cyan-600 text-xs font-medium flex items-center gap-1">
                <Snowflake className="w-3 h-3" />
                Nieve:
              </span>
              <span className="font-bold text-cyan-700 text-xs">{data.frecuencia_nieve}</span>
            </div>
          )}
          
          {data.frecuencia_caudal > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                <Waves className="w-3 h-3" />
                Caudal:
              </span>
              <span className="font-bold text-green-700 text-xs">{data.frecuencia_caudal}</span>
            </div>
          )}
          
          <div className="pt-2 mt-2 border-t border-slate-100 text-xs text-slate-500">
            <div>Rango: {data.rango_inicio} - {data.rango_fin} {unidad}</div>
            <div>Porcentaje: {data.porcentaje?.toFixed(1)}%</div>
          </div>
        </div>
        
        {esRangoMasFrecuente && (
          <div className="mt-2 pt-2 border-t border-orange-200 text-xs text-orange-600 font-semibold text-center flex items-center justify-center gap-1">
            <Star className="w-3 h-3 fill-orange-600" />
            Rango más frecuente
          </div>
        )}
      </div>
    );
  };

  const unidad = estadisticas?.unidad_medida || "mm";

  const totalMediciones = data.reduce((sum, item) => sum + item.frecuencia, 0);
  const rangoMasFrecuente = data.reduce((max, item) => item.frecuencia > max.frecuencia ? item : max, data[0]);

  return (
    <div className="space-y-3">
      {/* Estadísticas resumidas */}
      {estadisticas && (
        <div className="grid grid-cols-4 gap-2 text-center" role="region" aria-label="Resumen estadístico">
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-blue-900 font-bold text-sm" aria-label={`${estadisticas.total_mediciones} mediciones totales`}>{estadisticas.total_mediciones}</p>
            <p className="text-blue-700 text-xs">Mediciones</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <p className="text-green-900 font-bold text-sm" aria-label={`Promedio ${estadisticas.valor_promedio.toFixed(1)} ${unidad}`}>{estadisticas.valor_promedio.toFixed(1)} {unidad}</p>
            <p className="text-green-700 text-xs">Promedio</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-2">
            <p className="text-orange-900 font-bold text-sm" aria-label={`Mínimo ${estadisticas.valor_minimo.toFixed(1)} ${unidad}`}>{estadisticas.valor_minimo.toFixed(1)} {unidad}</p>
            <p className="text-orange-700 text-xs">Mínimo</p>
          </div>
          <div className="bg-red-50 rounded-lg p-2">
            <p className="text-red-900 font-bold text-sm" aria-label={`Máximo ${estadisticas.valor_maximo.toFixed(1)} ${unidad}`}>{estadisticas.valor_maximo.toFixed(1)} {unidad}</p>
            <p className="text-red-700 text-xs">Máximo</p>
          </div>
        </div>
      )}

      <div 
        role="img" 
        aria-label={`Gráfico de análisis de frecuencia. Total de ${totalMediciones} mediciones distribuidas en ${data.length} rangos. Rango más frecuente: ${rangoMasFrecuente?.rango} ${unidad} con ${rangoMasFrecuente?.frecuencia} ocurrencias.`}
      >
        <ResponsiveContainer width="100%" height={320}>
        <AreaChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          accessibilityLayer
        >
          <title>Análisis de Frecuencia de Precipitación</title>
          <desc>
            Gráfico de áreas apiladas mostrando la distribución de frecuencias de precipitación 
            por tipo (lluvia, nieve, caudal) en {data.length} rangos. El rango más frecuente es 
            {rangoMasFrecuente?.rango} {unidad} con {rangoMasFrecuente?.frecuencia} mediciones.
          </desc>
          <defs>
            {/* Gradiente para Lluvia (azul) */}
            <linearGradient id="colorLluvia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
            </linearGradient>
            
            {/* Gradiente para Nieve (cyan/turquesa) */}
            <linearGradient id="colorNieve" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2}/>
            </linearGradient>
            
            {/* Gradiente para Caudal (verde) */}
            <linearGradient id="colorCaudal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          <XAxis 
            dataKey="rango" 
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            label={{ value: `Rango (${unidad})`, position: 'insideBottom', offset: -10, style: { fontSize: 12 } }}
          />
          
          <YAxis 
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5 5' }} />
          
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="square"
          />
          
          {/* Línea de referencia para el promedio */}
          {estadisticas && (
            <ReferenceLine 
              y={estadisticas.total_mediciones / data.length} 
              stroke="#f97316" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: 'Promedio', position: 'right', fill: '#f97316', fontSize: 10 }}
            />
          )}
          
          {/* Área de Lluvia (azul) - base */}
          <Area 
            type="monotone"
            dataKey="frecuencia_lluvia" 
            stackId="1"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLluvia)"
            name="Lluvia"
          />
          
          {/* Área de Nieve (cyan) - apilada sobre Lluvia */}
          <Area 
            type="monotone"
            dataKey="frecuencia_nieve" 
            stackId="1"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorNieve)"
            name="Nieve"
          />
          
          {/* Área de Caudal (verde) - apilada sobre Nieve */}
          <Area 
            type="monotone"
            dataKey="frecuencia_caudal" 
            stackId="1"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCaudal)"
            name="Caudal"
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalisisFrecuencia;
