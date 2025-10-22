/**
 * 🎯 EJEMPLO SUPER SIMPLE - Copiar y pegar
 * 
 * Este es el ejemplo más simple de cómo usar el gráfico con tus datos reales.
 * Solo copia y pega en tu componente.
 */

import { PrecipitacionPorZonaConAPI } from '../specific/PrecipitacionPorZonaConAPI';

// ========================================
// OPCIÓN 1: USO SÚPER SIMPLE (RECOMENDADO)
// ========================================
export function EjemploSimple() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Dashboard</h1>
      
      {/* ¡Eso es todo! El componente hace todo automáticamente */}
      <PrecipitacionPorZonaConAPI />
    </div>
  );
}

// ========================================
// OPCIÓN 2: ESPECIFICAR ZONAS PERSONALIZADAS
// ========================================
export function EjemploConZonasPersonalizadas() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Precipitación Regional</h1>
      
      {/* Consultar zonas específicas */}
      <PrecipitacionPorZonaConAPI zonasIds={[1, 2, 3, 4, 5]} />
    </div>
  );
}

// ========================================
// OPCIÓN 3: MÚLTIPLES GRÁFICOS
// ========================================
export function EjemploMultiplesGraficos() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Completo</h1>
      
      {/* Gráfico de todas las zonas */}
      <PrecipitacionPorZonaConAPI zonasIds={[1, 2, 3]} />
      
      {/* Más gráficos aquí... */}
    </div>
  );
}

// ========================================
// OPCIÓN 4: EN UN GRID RESPONSIVE
// ========================================
export function EjemploGrid() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard en Grid</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna 1 */}
        <PrecipitacionPorZonaConAPI zonasIds={[1, 2, 3]} />
        
        {/* Columna 2 - Otro gráfico */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Otro gráfico aquí...</p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// OPCIÓN 5: CON URL PERSONALIZADA
// ========================================
export function EjemploURLPersonalizada() {
  return (
    <div className="p-6">
      <PrecipitacionPorZonaConAPI 
        zonasIds={[1, 2, 3]}
        apiBaseUrl="https://mi-servidor.com/api"
      />
    </div>
  );
}

/**
 * ============================================
 * 📝 CÓMO USAR EN TU PROYECTO:
 * ============================================
 * 
 * 1. Copia cualquiera de los ejemplos de arriba
 * 2. Pégalo en tu componente
 * 3. Ajusta los zonasIds según tus zonas
 * 4. ¡Listo! El gráfico mostrará tus datos reales
 * 
 * ============================================
 * 🎯 LO MÁS SIMPLE:
 * ============================================
 * 
 * import { PrecipitacionPorZonaConAPI } from '@/components/Dashboard/Charts/specific';
 * 
 * function MiPagina() {
 *   return <PrecipitacionPorZonaConAPI />;
 * }
 * 
 */

export default EjemploSimple;
