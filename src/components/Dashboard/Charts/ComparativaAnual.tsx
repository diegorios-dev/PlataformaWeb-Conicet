import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type AnioData = {
  anio: number;
  cantidad_registros: number;
  total_precipitacion: number;
  promedio_precipitacion: number;
  maximo_precipitacion: number;
  minimo_precipitacion: number;
};

type MesData = {
  mes: number;
  mes_nombre: string;
  anios: {
    [key: string]: AnioData;
  };
};

interface ComparativaAnualProps {
  data: MesData[];
  totales?: Array<{
    anio: number;
    cantidad_registros: number;
    total_precipitacion: number;
    promedio_precipitacion: number;
  }>;
  configuracion?: {
    anios_comparados: number[];
    mes_inicio: number;
    mes_fin: number;
    rango_meses: string;
    unidad_medida: string;
  };
}

const ComparativaAnual = ({ data, totales, configuracion }: ComparativaAnualProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-slate-500">
        No hay datos disponibles para la comparativa anual
      </div>
    );
  }

  // Colores progresivos: más antiguos (azul) → más recientes (naranja/rojo)
  const colorPalette = [
    "#3b82f6", // Azul
    "#06b6d4", // Cyan
    "#10b981", // Verde
    "#f59e0b", // Amarillo
    "#f97316", // Naranja
    "#ef4444", // Rojo
    "#8b5cf6", // Púrpura
    "#ec4899", // Rosa
    "#14b8a6", // Teal
    "#a855f7", // Violeta
  ];

  // Transformar datos del backend al formato que necesita Recharts
  const chartData = data.map((mesItem) => {
    const punto: any = {
      mes: mesItem.mes_nombre,
    };
    
    // Agregar los datos de cada año
    Object.keys(mesItem.anios).forEach((anio) => {
      const anioData = mesItem.anios[anio];
      // Usamos total_precipitacion para el gráfico principal
      punto[`anio_${anio}`] = anioData.total_precipitacion || 0;
      // Guardamos otros datos para el tooltip
      punto[`registros_${anio}`] = anioData.cantidad_registros;
      punto[`promedio_${anio}`] = anioData.promedio_precipitacion;
      punto[`maximo_${anio}`] = anioData.maximo_precipitacion;
      punto[`minimo_${anio}`] = anioData.minimo_precipitacion;
    });
    
    return punto;
  });

  // Obtener lista de años para crear las líneas
  const anios = configuracion?.anios_comparados || 
    (data.length > 0 ? Object.keys(data[0].anios).map(Number).sort() : []);
  
  const unidad = configuracion?.unidad_medida || "mm";
  const anioActual = new Date().getFullYear();

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    
    const mes = payload[0]?.payload?.mes;
    
    return (
      <div className="backdrop-blur-xl bg-white/95 border-2 border-blue-200 rounded-2xl shadow-2xl p-4 min-w-[280px]">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-blue-100">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
          <h3 className="font-bold text-slate-800 text-base">{mes}</h3>
        </div>
        
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => {
            const anio = entry.dataKey.replace('anio_', '');
            const total = entry.value;
            const registros = entry.payload[`registros_${anio}`];
            const promedio = entry.payload[`promedio_${anio}`];
            const maximo = entry.payload[`maximo_${anio}`];
            const esAnioActual = parseInt(anio) === anioActual;
            
            return (
              <div key={index} className={`space-y-1 pb-2 border-b border-slate-100 ${esAnioActual ? 'bg-orange-50 -mx-2 px-2 py-1 rounded-lg' : ''}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    <div style={{ width: 12, height: 12, backgroundColor: entry.color, borderRadius: '50%' }}></div>
                    {anio} {esAnioActual && '⭐'}
                  </span>
                  <span className="font-bold text-slate-900">{total.toFixed(1)} {unidad}</span>
                </div>
                <div className="text-xs text-slate-600 pl-5 space-y-0.5">
                  <div>📊 Registros: {registros}</div>
                  <div>📈 Promedio: {promedio?.toFixed(2)} {unidad}</div>
                  <div>🔝 Máximo: {maximo?.toFixed(1)} {unidad}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Encontrar el año con mayor y menor precipitación total
  const anioMaximo = totales?.reduce((max, item) => 
    item.total_precipitacion > max.total_precipitacion ? item : max
  , totales[0]);
  
  const anioMinimo = totales?.reduce((min, item) => 
    item.total_precipitacion < min.total_precipitacion ? item : min
  , totales[0]);

  return (
    <div className="space-y-4">
      {/* Tarjetas de totales */}
      {totales && totales.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {totales.map((total, index) => {
            const esMaximo = total.anio === anioMaximo?.anio;
            const esMinimo = total.anio === anioMinimo?.anio;
            const esActual = total.anio === anioActual;
            
            return (
              <div 
                key={total.anio} 
                className={`rounded-lg p-3 border-2 ${
                  esActual ? 'bg-orange-50 border-orange-300' : 
                  esMaximo ? 'bg-green-50 border-green-300' : 
                  esMinimo ? 'bg-blue-50 border-blue-300' : 
                  'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="font-bold text-sm text-slate-800 flex items-center gap-1">
                  {total.anio} 
                  {esActual && ' ⭐'}
                  {esMaximo && ' 🏆'}
                  {esMinimo && ' 💧'}
                </p>
                <p className="text-lg font-bold" style={{ color: colorPalette[index % colorPalette.length] }}>
                  {total.total_precipitacion.toFixed(1)} {unidad}
                </p>
                <p className="text-xs text-slate-600">{total.cantidad_registros} registros</p>
              </div>
            );
          })}
        </div>
      )}

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="mes" 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748b"
            label={{ value: unidad, angle: -90, position: 'insideLeft' }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="line"
          />
          
          {/* Crear una línea por cada año */}
          {anios.map((anio, index) => {
            const esAnioActual = anio === anioActual;
            return (
              <Line
                key={anio}
                type="monotone"
                dataKey={`anio_${anio}`}
                name={`${anio}${esAnioActual ? ' (Actual)' : ''}`}
                stroke={colorPalette[index % colorPalette.length]}
                strokeWidth={esAnioActual ? 3 : 2}
                dot={{ 
                  r: esAnioActual ? 5 : 3,
                  fill: colorPalette[index % colorPalette.length],
                  strokeWidth: esAnioActual ? 2 : 0,
                  stroke: '#fff'
                }}
                activeDot={{ r: 6 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Leyenda adicional */}
      {configuracion && (
        <div className="text-xs text-slate-600 text-center">
          Comparando: {configuracion.rango_meses}
        </div>
      )}
    </div>
  );
};

export default ComparativaAnual;
