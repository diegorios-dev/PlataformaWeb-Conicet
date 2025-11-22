import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Droplet, BarChart3 } from "lucide-react";

type SitioData = {
  site_id: number;
  latitude: number;
  longitude: number;
  total_precipitacion: number;
  cantidad_reportes: number;
  zona: string;
  tipo_evento: string;
};

type Props = {
  data: SitioData[];
  periodo?: string;
  tipoEvento?: string;
};

const PrecipitacionCoordenadas = ({ data }: Props) => {
  console.log('Datos recibidos:', data);
  
  // Memoizar el procesamiento de puntos para evitar recalcular en cada render
  const puntos = useMemo(() => {
    if (!data?.length) {
      console.log('No hay datos para mostrar');
      return [];
    }

    return data.map(item => {
      // Validar y convertir las coordenadas
      const latitud = parseFloat(String(item.latitude));
      const longitud = parseFloat(String(item.longitude));

      if (isNaN(latitud) || isNaN(longitud)) {
        console.warn('Coordenadas inválidas para el sitio:', item.zona);
        return null;
      }

      return {
        x: latitud,
        y: longitud,
        precipitacion: Number(item.total_precipitacion) || 0,
        reportes: Number(item.cantidad_reportes) || 0,
        sitio: item.zona || "Sin nombre",
        tipo: (item.tipo_evento || "").toLowerCase()
      };
    }).filter(punto => punto !== null);
  }, [data]);
  
  if (!puntos.length) {
    return null;
  }

  // Componente personalizado para el tooltip con mejor espaciado
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="backdrop-blur-xl bg-white/95 border-2 border-cyan-200 rounded-2xl shadow-2xl p-4 min-w-[200px]">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-cyan-100">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600"></div>
          <h3 className="font-bold text-slate-800 text-base">{data.sitio}</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600 text-sm font-medium flex items-center gap-1">
              <Droplet className="w-4 h-4 text-cyan-600" />
              Precipitación:
            </span>
            <span className="font-bold text-cyan-700 text-sm">{data.precipitacion} mm</span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            
            <span className="text-slate-600 text-sm font-medium flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-slate-600" />
              Reportes:
            </span>

            <span className="font-bold text-slate-700 text-sm">{data.reportes}</span>
          </div>
          
          <div className="pt-2 mt-2 border-t border-slate-100 text-xs text-slate-500">
            <div>Lat: {data.x.toFixed(4)}°</div>
            <div>Lng: {data.y.toFixed(4)}°</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" dataKey="x" name="Latitud" stroke="#64748b" />
        <YAxis type="number" dataKey="y" name="Longitud" stroke="#64748b" />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Scatter 
          name="Sitios" 
          data={puntos}
          fill="#06b6d4"
          isAnimationActive={false}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default PrecipitacionCoordenadas;