# Sistema de Cache Simple

Sistema de cache en memoria para optimizar la carga de estadísticas.

## Características

- ✅ **Cache en memoria**: Rápido y sin límites de tamaño de localStorage
- ✅ **TTL configurable**: Por defecto 5 minutos
- ✅ **Invalidación automática**: Cuando se editan reportes
- ✅ **Invalidación manual**: Botón "Actualizar" en pantalla de estadísticas
- ✅ **Sin sobreingeniería**: ~100 líneas de código

## Uso

### Automático
Las estadísticas se cachean automáticamente. La primera carga tarda normal, las siguientes son instantáneas durante 5 minutos.

### Manual
**Refrescar datos**: Click en botón "Actualizar" en `/estadisticas`

**Consola del navegador**:
```javascript
// Ver tamaño del cache
import { cache } from './utils/simpleCache';
console.log('Entradas en cache:', cache.size());

// Limpiar todo el cache
cache.clear();

// Limpiar solo estadísticas
cache.invalidatePattern('estadisticas:');
```

## Invalidación Automática

El cache se limpia automáticamente cuando:
- Se actualiza un reporte (edición)
- Click en botón "Actualizar"

## Claves de Cache

Formato: `estadisticas:{tipo}:{parametros}`

Ejemplos:
- `estadisticas:precipitacion-zona`
- `estadisticas:evolucion-mensual:2024:todos`
- `estadisticas:patron-mensual:anio:lluvia`

## Logs de Console

```
✅ Cache hit: estadisticas:precipitacion-zona
🔄 Cache miss: estadisticas:top-zonas:10 - Fetching...
🗑️ Cache de estadísticas invalidado
```

## Configuración

**Cambiar TTL** en `estadisticasService.tsx`:
```typescript
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutos
```

## Archivos

- `src/utils/simpleCache.ts` - Manager de cache
- `src/services/estadisticasService.tsx` - Integración con API
- `src/components/Dashboard/Charts/useChartsData.ts` - Hook de datos
