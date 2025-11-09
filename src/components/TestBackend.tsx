/**
 * COMPONENTE DE PRUEBA RÁPIDA
 * 
 * Usa este componente para verificar que la integración con el backend funciona.
 * 
 * INSTRUCCIONES:
 * 1. Asegúrate de que el backend esté corriendo: php artisan serve
 * 2. Importa este componente en App.tsx
 * 3. Verifica que aparezcan datos reales del backend
 * 
 * USO:
 * import TestBackend from './components/TestBackend';
 * 
 * function App() {
 *   return <TestBackend />;
 * }
 */

import { useState, useEffect } from 'react';
import { getTotalAcumuladoPorZona } from '../services/zonaService';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../config/api';

const TestBackend = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus('loading');
    setError('');

    try {
      console.log('🔌 Probando conexión con backend...');
      const zonas = await getTotalAcumuladoPorZona();
      
      if (zonas && zonas.length > 0) {
        setData(zonas);
        setStatus('success');
        console.log('✅ Conexión exitosa!', zonas);
      } else {
        setStatus('error');
        setError('No hay datos en la base de datos');
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Error desconocido');
      console.error('❌ Error de conexión:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              🧪 Test de Conexión Backend
            </h1>
            <p className="text-slate-600">
              Verificando integración con Laravel API
            </p>
          </div>

          {/* Estado de Conexión */}
          <div className="mb-8">
            {status === 'loading' && (
              <div className="flex items-center justify-center gap-3 p-6 bg-blue-50 rounded-xl">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <p className="text-blue-800 font-semibold">Conectando al backend...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center justify-center gap-3 p-6 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <p className="text-green-800 font-semibold">
                  ✅ Conexión exitosa con el backend!
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="p-6 bg-red-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <p className="text-red-800 font-semibold">
                    ❌ Error de conexión
                  </p>
                </div>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                
                <div className="bg-red-100 rounded-lg p-4 text-sm text-red-800">
                  <p className="font-semibold mb-2">Posibles causas:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>El backend no está corriendo</li>
                    <li>URL incorrecta (debe ser {API_URL})</li>
                    <li>CORS no está configurado</li>
                    <li>No hay datos en la base de datos</li>
                  </ul>
                  <p className="mt-3 font-semibold">Solución:</p>
                  <code className="block bg-red-200 p-2 rounded mt-2">
                    php artisan serve
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Información de Conexión */}
          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-3">
              📡 Información de Conexión
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Backend URL:</span>
                <code className="bg-slate-200 px-2 py-1 rounded text-slate-800">
                  {API_URL}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Endpoint:</span>
                <code className="bg-slate-200 px-2 py-1 rounded text-slate-800">
                  /zonas/total-acumulado
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estado:</span>
                <span className={`font-semibold ${
                  status === 'success' ? 'text-green-600' :
                  status === 'error' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {status === 'loading' ? 'Conectando...' :
                   status === 'success' ? 'Conectado' :
                   'Desconectado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Registros:</span>
                <span className="font-semibold text-slate-800">
                  {data.length} zonas
                </span>
              </div>
            </div>
          </div>

          {/* Datos Obtenidos */}
          {status === 'success' && data.length > 0 && (
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">
                📊 Datos Obtenidos ({data.length} registros)
              </h3>
              
              <div className="space-y-3">
                {data.slice(0, 5).map((zona: any, index: number) => (
                  <div 
                    key={zona.id || index}
                    className="bg-white rounded-lg p-4 border border-green-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-800">
                          📍 {zona.locality || 'Sin nombre'}
                        </p>
                        <p className="text-sm text-slate-600">
                          ID: {zona.id} • Sitios: {zona.sitios_count || 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {parseFloat(zona.total_acumulado).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">mm acumulados</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {data.length > 5 && (
                  <p className="text-center text-slate-500 text-sm pt-2">
                    ... y {data.length - 5} zonas más
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Botón de Reintentar */}
          <div className="mt-6 text-center">
            <button
              onClick={testConnection}
              disabled={status === 'loading'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {status === 'loading' ? 'Probando...' : '🔄 Probar Nuevamente'}
            </button>
          </div>

          {/* JSON Raw Data (para debugging) */}
          {status === 'success' && data.length > 0 && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 font-semibold">
                👨‍💻 Ver JSON completo (debugging)
              </summary>
              <pre className="mt-3 bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          )}

        </div>

        {/* Instrucciones */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">
            📚 Próximos Pasos
          </h3>
          <ol className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>Si la conexión es exitosa, puedes ir al Dashboard de Estadísticas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>Verifica que todos los gráficos carguen datos correctamente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>Prueba el botón de "Actualizar" en el Dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">4.</span>
              <span>Revisa la consola del navegador (F12) para ver los logs</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestBackend;
