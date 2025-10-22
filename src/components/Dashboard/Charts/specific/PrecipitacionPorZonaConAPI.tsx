/**
 * Ejemplo de uso del gráfico PrecipitacionPorZona con datos reales de la API
 * 
 * Endpoint: http://localhost:8000/api/zona/{id}/total-acumulado
 * Respuesta: {
 *   "id": 3,
 *   "locality": "Bariloche",
 *   "total_acumulado": 0,
 *   "sitios": []
 * }
 */

import React, { useEffect, useState } from 'react';
import { PrecipitacionPorZona } from '../specific';

interface ZonaData {
  id: number;
  locality: string;
  total_acumulado: number;
  sitios: any[];
}

interface Props {
  zonasIds?: number[];
  apiBaseUrl?: string;
}

export const PrecipitacionPorZonaConAPI: React.FC<Props> = ({ 
  zonasIds = [1, 2, 3], // IDs de las zonas a consultar
  apiBaseUrl = 'http://localhost:8000/api'
}) => {
  const [data, setData] = useState<ZonaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZonasData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Opción 1: Si tienes un endpoint que devuelve todas las zonas
        // const response = await fetch(`${apiBaseUrl}/zonas/total-acumulado`);
        // const data = await response.json();
        // setData(data);

        // Opción 2: Hacer peticiones individuales por cada zona
        const promesas = zonasIds.map(async (id) => {
          const response = await fetch(`${apiBaseUrl}/zona/${id}/total-acumulado`);
          if (!response.ok) {
            throw new Error(`Error al cargar zona ${id}`);
          }
          return response.json();
        });

        const resultados = await Promise.all(promesas);
        
        // Filtrar zonas sin datos si es necesario
        const zonasConDatos = resultados.filter(zona => zona.total_acumulado > 0);
        
        setData(zonasConDatos.length > 0 ? zonasConDatos : resultados);
        
      } catch (err: any) {
        console.error('Error al cargar datos de zonas:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchZonasData();
  }, [zonasIds, apiBaseUrl]);

  // Estado de carga
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" style={{ height: 400 }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Cargando precipitación por zona...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" style={{ height: 400 }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">Error al cargar datos</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sin datos
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" style={{ height: 400 }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">📊</p>
            <p className="text-gray-600">No hay datos de precipitación disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar gráfico con datos
  return <PrecipitacionPorZona data={data} />;
};

/**
 * EJEMPLO DE USO:
 * 
 * // Uso básico (consulta zonas 1, 2, 3 por defecto)
 * <PrecipitacionPorZonaConAPI />
 * 
 * // Especificar zonas personalizadas
 * <PrecipitacionPorZonaConAPI zonasIds={[1, 2, 3, 4, 5]} />
 * 
 * // Especificar URL de API diferente
 * <PrecipitacionPorZonaConAPI 
 *   zonasIds={[1, 2, 3]} 
 *   apiBaseUrl="https://mi-api.com/api"
 * />
 */
