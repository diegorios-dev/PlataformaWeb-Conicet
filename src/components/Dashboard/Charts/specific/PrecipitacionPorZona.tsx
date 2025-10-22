// Componentes específicos para estadísticas de precipitación
import React from 'react';
import { BaseBarChart, type BarChartData } from '../BaseBarChart';

// Interfaz para los datos que vienen de la API
interface ZonaAPIData {
  id: number;
  locality: string;
  total_acumulado: number;
  sitios: any[];
}

interface PrecipitacionPorZonaProps {
  data: ZonaAPIData[];
}

export const PrecipitacionPorZona: React.FC<PrecipitacionPorZonaProps> = ({ data }) => {
  // Filtrar datos válidos (que tengan id y locality)
  const zonasValidas = data.filter(zona => 
    zona && 
    typeof zona === 'object' && 
    'id' in zona && 
    'locality' in zona
  );

  // Transformar datos de la API al formato que espera el gráfico
  const chartData: BarChartData[] = zonasValidas.map(zona => ({
    name: zona.locality,
    value: zona.total_acumulado
  }));

  console.log('PrecipitacionPorZona - Datos para el gráfico:', chartData);

  // Verificar si hay al menos una zona con precipitación
  const tieneDataConValores = zonasValidas.some(zona => zona.total_acumulado > 0);

  // Sin zonas válidas
  if (zonasValidas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" style={{ height: 400 }}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Precipitación Total por Zona</h3>
        <p className="text-sm text-gray-600 mb-4">Acumulado de precipitación registrada en cada zona</p>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">⚠️</p>
            <p className="text-gray-600 font-medium">No hay zonas disponibles</p>
            <p className="text-gray-500 text-sm mt-1">Verifica las zonas consultadas</p>
          </div>
        </div>
      </div>
    );
  }

  // Mensaje si no hay datos
  if (!tieneDataConValores) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" style={{ height: 400 }}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Precipitación Total por Zona</h3>
        <p className="text-sm text-gray-600 mb-4">Acumulado de precipitación registrada en cada zona</p>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">📊</p>
            <p className="text-gray-600 font-medium">Sin precipitación registrada</p>
            <p className="text-gray-500 text-sm mt-1">
              {zonasValidas.length} {zonasValidas.length === 1 ? 'zona consultada' : 'zonas consultadas'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseBarChart
      data={chartData}
      title="Precipitación Total por Zona"
      subtitle="Acumulado de precipitación registrada en cada zona"
      yAxisLabel="Precipitación (mm)"
      unit="mm"
      colorByValue={true}
      height={400}
    />
  );
};
