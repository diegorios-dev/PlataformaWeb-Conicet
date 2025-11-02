import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  
  if (!data?.length) {
    console.log('No hay datos para mostrar');
    return null;
  }

  const puntos = data.map(item => {
    // Validar y convertir las coordenadas
    const latitud = parseFloat(String(item.latitude));
    const longitud = parseFloat(String(item.longitude));
    
    console.log('Coordenadas originales:', { latitud: item.latitude, longitud: item.longitude });
    console.log('Coordenadas convertidas:', { latitud, longitud });

    if (isNaN(latitud) || isNaN(longitud)) {
      console.warn('Coordenadas inválidas para el sitio:', item.zona);
      return null;
    }

    const punto = {
      x: latitud,
      y: longitud,
      precipitacion: Number(item.total_precipitacion) || 0,
      reportes: Number(item.cantidad_reportes) || 0,
      sitio: item.zona || "Sin nombre",
      tipo: (item.tipo_evento || "").toLowerCase()
    };
    console.log('Punto procesado:', punto);
    return punto;
  }).filter(punto => punto !== null);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" dataKey="x" name="Latitud" stroke="#64748b" />
        <YAxis type="number" dataKey="y" name="Longitud" stroke="#64748b" />
        <Tooltip formatter={(...args: any[]) => {
          // args: [value, name, props]
          const props = args[2];
          const entry = props?.payload;
          if (!entry) return ["", ""];
          return [
            <div key={entry.sitio}>
              <strong>{entry.sitio}</strong>
              <div>{entry.precipitacion} mm</div>
              <div>{entry.reportes} reportes</div>
            </div>,
            ""
          ];
        }} />
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