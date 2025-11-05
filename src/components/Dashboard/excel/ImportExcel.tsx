import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

interface ImportResult {
  insertadas?: number;
  actualizadas?: number;
  insertados?: number;
  actualizados?: number;
  errores?: number;
}

interface ImportResponse {
  success: boolean;
  message: string;
  resultados: {
    zonas: ImportResult;
    sitios: ImportResult;
    usuarios: ImportResult;
    instrumentos_usuarios: ImportResult;
  };
}

export default function ImportarExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Descargar plantilla
  const descargarPlantilla = async () => {
    try {
      const response = await axios.get(`${API_URL}/import/plantilla`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plantilla_importacion_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError('Error al descargar la plantilla: ' + (err.response?.data?.message || err.message));
    }
  };

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validar extensión
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Solo se permiten archivos Excel (.xlsx, .xls)');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (!droppedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Solo se permiten archivos Excel (.xlsx, .xls)');
        return;
      }
      
      setFile(droppedFile);
      setError(null);
      setResult(null);
    }
  };

  // Importar archivo
  const importarArchivo = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<ImportResponse>(`${API_URL}/import/excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      setFile(null);
    } catch (err: any) {
      console.error('Error al importar:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Error al importar el archivo. Verifica el formato y vuelve a intentar.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Limpiar archivo seleccionado
  const limpiarArchivo = () => {
    setFile(null);
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📥 Importación Masiva desde Excel
          </h1>
          <p className="text-gray-600">
            Carga datos de zonas, sitios, usuarios y relaciones instrumento-usuario desde un archivo Excel
          </p>
        </div>

        {/* Descargar Plantilla */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1️⃣ Descargar Plantilla
          </h2>
          <p className="text-gray-600 mb-4">
            Descarga la plantilla Excel con la estructura correcta y ejemplos de datos.
          </p>
          <button
            onClick={descargarPlantilla}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Plantilla Excel
          </button>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2️⃣ Cargar Archivo Excel
          </h2>
          
          {/* Drag & Drop Zone */}
          <div
            className={`border-3 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 mb-2">
                  Arrastra tu archivo Excel aquí o
                </p>
                <label className="cursor-pointer">
                  <span className="text-blue-500 hover:text-blue-600 font-semibold">
                    haz clic para seleccionar
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Formatos aceptados: .xlsx, .xls
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={limpiarArchivo}
                  className="ml-4 text-red-500 hover:text-red-600"
                  title="Eliminar archivo"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Botón de Importar */}
          <button
            onClick={importarArchivo}
            disabled={!file || loading}
            className={`mt-6 w-full font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 ${
              !file || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importando...
              </span>
            ) : (
              '🚀 Importar Datos'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && result.success && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-6">
            <div className="flex items-start mb-4">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-800 text-lg">{result.message}</h3>
              </div>
            </div>

            {/* Resultados detallados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Zonas */}
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-gray-700 mb-2">🗺️ Zonas</h4>
                <p className="text-sm text-gray-600">
                  Insertadas: <span className="font-bold text-green-600">{result.resultados.zonas.insertadas || 0}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Actualizadas: <span className="font-bold text-blue-600">{result.resultados.zonas.actualizadas || 0}</span>
                </p>
              </div>

              {/* Sitios */}
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-gray-700 mb-2">📍 Sitios</h4>
                <p className="text-sm text-gray-600">
                  Insertados: <span className="font-bold text-green-600">{result.resultados.sitios.insertados || 0}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Actualizados: <span className="font-bold text-blue-600">{result.resultados.sitios.actualizados || 0}</span>
                </p>
              </div>

              {/* Usuarios */}
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-gray-700 mb-2">👥 Usuarios</h4>
                <p className="text-sm text-gray-600">
                  Insertados: <span className="font-bold text-green-600">{result.resultados.usuarios.insertados || 0}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Actualizados: <span className="font-bold text-blue-600">{result.resultados.usuarios.actualizados || 0}</span>
                </p>
              </div>

              {/* Instrumentos-Usuarios */}
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-semibold text-gray-700 mb-2">🔗 Relaciones Instrumento-Usuario</h4>
                <p className="text-sm text-gray-600">
                  Insertadas: <span className="font-bold text-green-600">{result.resultados.instrumentos_usuarios.insertados || 0}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Errores: <span className="font-bold text-red-600">{result.resultados.instrumentos_usuarios.errores || 0}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Instrucciones
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Descarga la plantilla Excel haciendo clic en el botón verde</li>
            <li>Abre el archivo y completa las 4 hojas con tus datos:
              <ul className="list-disc list-inside ml-6 mt-2 text-sm text-gray-600">
                <li><strong>Zonas:</strong> Nombres de las zonas geográficas</li>
                <li><strong>Sitios:</strong> Nombre del sitio, coordenadas (latitud/longitud), zona y evento asociado</li>
                <li><strong>Usuarios:</strong> Personas del sistema con nombre, contraseña, rol, zona y sitio (opcional)</li>
                <li><strong>Instrumentos_Usuarios:</strong> Relaciones entre usuarios e instrumentos (solo 2 columnas: usuario e instrumento)</li>
              </ul>
            </li>
            <li>Guarda el archivo Excel</li>
            <li>Arrastra el archivo a la zona de carga o haz clic para seleccionarlo</li>
            <li>Presiona el botón "Importar Datos"</li>
            <li>Espera a que se complete la importación y verifica los resultados</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ IMPORTANTE:</strong> Los eventos e instrumentos deben existir previamente en la base de datos. 
              Ejecuta <code className="bg-yellow-100 px-2 py-1 rounded">php artisan db:seed</code> antes de importar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
