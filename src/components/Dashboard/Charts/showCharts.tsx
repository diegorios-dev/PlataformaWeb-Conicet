import React from 'react';
import { useEffect, useState } from 'react';
import {
  PrecipitacionPorZona,
  ReportesPorInstrumento,
  EvolucionTemporalPorZona,
  DistribucionPorTipo,
  PrecipitacionVsLatitud,
  PrecipitacionMensualRadar,
  ComparativaZonasAreas,
  LluviaVsNieveBarrasAgrupadas,
  PrecipitacionConPromedio,
  TopSitiosPrecipitacion
} from './specific';


/**
 * Componente de ejemplo que muestra cómo usar todos los gráficos
 * Este archivo es solo de referencia, puedes adaptarlo a tus necesidades
 */
export const ShowCharts: React.FC = () => {
  // Estado para datos de la API
  const [dataPorZona, setDataPorZona] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de todas las zonas
  useEffect(() => {
    const fetchZonasData = async () => {
      try {
        setLoading(true);
        
        // Si tienes un endpoint que devuelve todas las zonas, úsalo así:
        // const response = await fetch('http://localhost:8000/api/zonas/total-acumulado');
        // const data = await response.json();
        // setDataPorZona(data);
        
        // Si no, necesitas hacer peticiones individuales por cada zona ID
        // Aquí asumo que tienes las zonas con IDs: 1, 2, 3, etc.
        const zonasIds = [1, 2, 3]; // Ajusta según tus zonas
        
        const promesas = zonasIds.map(id =>
          fetch(`http://localhost:8000/api/zona/${id}/total-acumulado`)
            .then(res => res.json())
            .catch(err => {
              console.error(`Error al cargar zona ${id}:`, err);
              return null;
            })
        );
        
        const resultados = await Promise.all(promesas);
        console.log('Datos de zonas (raw):', resultados);
        
        // Filtrar resultados válidos: debe tener 'id' y 'locality'
        const zonasValidas = resultados.filter(zona => 
          zona && 
          typeof zona === 'object' && 
          'id' in zona && 
          'locality' in zona &&
          !zona.message // Excluir objetos con mensaje de error
        );
        
        console.log('Datos de zonas (filtradas):', zonasValidas);
        setDataPorZona(zonasValidas);
        
      } catch (error) {
        console.error('Error al cargar datos de zonas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZonasData();
  }, []);

  // ===== DATOS DE EJEMPLO PARA OTROS GRÁFICOS =====

  const dataReportes = [
    { instrumento: 'Pluviómetro A1', cantidad: 245 },
    { instrumento: 'Pluviómetro B2', cantidad: 189 },
    { instrumento: 'Caudalímetro C1', cantidad: 156 },
    { instrumento: 'Nivómetro D1', cantidad: 98 }
  ];

  const dataEvolucion = [
    { fecha: '2025-01-01', zona1: 45, zona2: 32, zona3: 51 },
    { fecha: '2025-01-08', zona1: 52, zona2: 38, zona3: 48 },
    { fecha: '2025-01-15', zona1: 38, zona2: 45, zona3: 55 },
    { fecha: '2025-01-22', zona1: 62, zona2: 51, zona3: 43 },
    { fecha: '2025-01-29', zona1: 48, zona2: 39, zona3: 58 }
  ];

  const zonasConfig = [
    { id: 'zona1', nombre: 'Zona Norte', color: '#3B82F6' },
    { id: 'zona2', nombre: 'Zona Sur', color: '#10B981' },
    { id: 'zona3', nombre: 'Zona Este', color: '#F59E0B' }
  ];

  const dataTipo = [
    { tipo: 'Lluvia', cantidad: 1250 },
    { tipo: 'Nieve', cantidad: 450 },
    { tipo: 'Caudal', cantidad: 780 }
  ];

  const dataLatitud = [
    { sitio: 'Sitio A', latitud: -33.45, longitud: -70.65, precipitacion: 450 },
    { sitio: 'Sitio B', latitud: -33.52, longitud: -70.58, precipitacion: 520 },
    { sitio: 'Sitio C', latitud: -33.38, longitud: -70.72, precipitacion: 380 },
    { sitio: 'Sitio D', latitud: -33.61, longitud: -70.45, precipitacion: 610 }
  ];

  const dataMensual = [
    { mes: 'Enero', promedio: 45, actual: 52 },
    { mes: 'Febrero', promedio: 38, actual: 42 },
    { mes: 'Marzo', promedio: 62, actual: 58 },
    { mes: 'Abril', promedio: 78, actual: 85 },
    { mes: 'Mayo', promedio: 125, actual: 118 },
    { mes: 'Junio', promedio: 156, actual: 162 },
    { mes: 'Julio', promedio: 148, actual: 155 },
    { mes: 'Agosto', promedio: 132, actual: 128 },
    { mes: 'Septiembre', promedio: 95, actual: 102 },
    { mes: 'Octubre', promedio: 58, actual: 61 },
    { mes: 'Noviembre', promedio: 42, actual: 38 },
    { mes: 'Diciembre', promedio: 35, actual: 41 }
  ];

  const dataLluviaNieve = [
    { sitio: 'Cordillera A', lluvia: 120, nieve: 85 },
    { sitio: 'Valle B', lluvia: 245, nieve: 15 },
    { sitio: 'Precordillera C', lluvia: 185, nieve: 52 },
    { sitio: 'Costa D', lluvia: 320, nieve: 0 }
  ];

  const dataMultimetrica = [
    { fecha: '2025-10-01', precipitacion: 45, promedio: 42, reportes: 12 },
    { fecha: '2025-10-02', precipitacion: 52, promedio: 43, reportes: 15 },
    { fecha: '2025-10-03', precipitacion: 38, promedio: 44, reportes: 11 },
    { fecha: '2025-10-04', precipitacion: 65, promedio: 46, reportes: 18 },
    { fecha: '2025-10-05', precipitacion: 48, promedio: 47, reportes: 14 }
  ];

  const dataTopSitios = [
    { sitio: 'Sitio A', precipitacion: 1250 },
    { sitio: 'Sitio B', precipitacion: 980 },
    { sitio: 'Sitio C', precipitacion: 1450 },
    { sitio: 'Sitio D', precipitacion: 760 },
    { sitio: 'Sitio E', precipitacion: 1180 },
    { sitio: 'Sitio F', precipitacion: 890 },
    { sitio: 'Sitio G', precipitacion: 1520 },
    { sitio: 'Sitio H', precipitacion: 650 },
    { sitio: 'Sitio I', precipitacion: 1320 },
    { sitio: 'Sitio J', precipitacion: 920 }
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard de Estadísticas de Precipitación
        </h1>
        <p className="text-gray-600">
          Visualización interactiva de datos meteorológicos
        </p>
      </div>

      {/* Mostrar loading mientras se cargan los datos */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Grid 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras - Precipitación por Zona CON DATOS REALES */}
            <PrecipitacionPorZona data={dataPorZona} />

            {/* Gráfico de Barras - Reportes por Instrumento */}
            <ReportesPorInstrumento data={dataReportes} />
          </div>

      {/* Gráfico de Líneas - Ancho completo */}
      <div className="w-full">
        <EvolucionTemporalPorZona data={dataEvolucion} zonas={zonasConfig} />
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Torta */}
        <DistribucionPorTipo data={dataTipo} />

        {/* Gráfico Radial */}
        <PrecipitacionMensualRadar data={dataMensual} />
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Dispersión */}
        <PrecipitacionVsLatitud data={dataLatitud} />

        {/* Gráfico de Barras Agrupadas */}
        <LluviaVsNieveBarrasAgrupadas data={dataLluviaNieve} />
      </div>

      {/* Gráfico de Áreas - Ancho completo */}
      <div className="w-full">
        <ComparativaZonasAreas 
          data={dataEvolucion} 
          zonas={zonasConfig} 
        />
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Compuesto */}
        <PrecipitacionConPromedio data={dataMultimetrica} />

        {/* Top 10 Sitios */}
        <TopSitiosPrecipitacion 
          data={dataTopSitios} 
          top={10} 
          orden="mayor" 
        />
      </div>
        </>
      )}
    </div>
  );
};

export default ShowCharts;
