import { useState } from 'react';
import axios from 'axios';
import BackButton from '../../BackButton';
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Trash2,
} from 'lucide-react';

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

  const getVal = (r: ImportResult | undefined, a: keyof ImportResult, b: keyof ImportResult) =>
    (r?.[a] ?? r?.[b] ?? 0) as number;

  // Descargar plantilla
  const descargarPlantilla = async () => {
    try {
      const response = await axios.get(`${API_URL}/import/plantilla`, { responseType: 'blob' });
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

  // Selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Solo se permiten archivos Excel (.xlsx, .xls)');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  // Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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
      setError('Por favor seleccioná un archivo');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post<ImportResponse>(`${API_URL}/import/excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      setFile(null);
    } catch (err: any) {
      console.error('Error al importar:', err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Error al importar el archivo. Verificá el formato y volvé a intentar.'
      );
    } finally {
      setLoading(false);
    }
  };

  const limpiarArchivo = () => {
    setFile(null);
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <BackButton />

        {/* Header estilo ShowReport */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Importación desde Excel
              </h1>
              <p className="text-base text-slate-600 mt-1 font-medium">
                Zonas, sitios, usuarios y relaciones instrumento-usuario
              </p>
            </div>
          </div>
        </div>

        {/* Card principal - pasos y carga */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl p-6 md:p-8 mb-6">
          {/* Paso 1: Descargar plantilla */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Descargar plantilla</h2>
                <p className="text-sm text-slate-600">
                  Bajá la plantilla Excel con la estructura correcta y ejemplos.
                </p>
              </div>
              <button
                onClick={descargarPlantilla}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-green-600/30 hover:shadow-xl transition-all"
              >
                <Download size={18} />
                Descargar Plantilla ejemplo
              </button>
            </div>
          </div>

          {/* Paso 2: Cargar archivo */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Cargar archivo Excel</h3>

            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-3 rounded-xl mb-3">
                    <UploadCloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-slate-700 mb-1">Arrastrá tu archivo Excel aquí</p>
                  <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-bold">
                    o hacé clic para seleccionar
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-2">Formatos aceptados: .xlsx, .xls</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={limpiarArchivo}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold border border-red-200 transition-colors"
                    title="Quitar archivo"
                  >
                    <Trash2 size={16} />
                    Quitar
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={importarArchivo}
              disabled={!file || loading}
              className={`mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                !file || loading
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/30 hover:shadow-xl'
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '🚀'}
              {loading ? 'Importando...' : 'Importar Datos'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-5 shadow-md">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-red-900 mb-1">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                  title="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {result && result.success && (
          <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b-2 border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Importación completada</h3>
                  <p className="text-xs text-slate-600">{result.message}</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Zonas */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="font-bold text-slate-800 mb-2">🗺️ Zonas</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white border border-green-200 rounded-xl px-3 py-2">
                    Insertadas: <span className="font-bold text-green-700">{getVal(result.resultados.zonas, 'insertadas', 'insertados')}</span>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-xl px-3 py-2">
                    Actualizadas: <span className="font-bold text-blue-700">{getVal(result.resultados.zonas, 'actualizadas', 'actualizados')}</span>
                  </div>
                </div>
              </div>

              {/* Sitios */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="font-bold text-slate-800 mb-2">📍 Sitios</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white border border-green-200 rounded-xl px-3 py-2">
                    Insertados: <span className="font-bold text-green-700">{getVal(result.resultados.sitios, 'insertados', 'insertadas')}</span>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-xl px-3 py-2">
                    Actualizados: <span className="font-bold text-blue-700">{getVal(result.resultados.sitios, 'actualizados', 'actualizadas')}</span>
                  </div>
                </div>
              </div>

              {/* Usuarios */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="font-bold text-slate-800 mb-2">👥 Usuarios</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white border border-green-200 rounded-xl px-3 py-2">
                    Insertados: <span className="font-bold text-green-700">{getVal(result.resultados.usuarios, 'insertados', 'insertadas')}</span>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-xl px-3 py-2">
                    Actualizados: <span className="font-bold text-blue-700">{getVal(result.resultados.usuarios, 'actualizados', 'actualizadas')}</span>
                  </div>
                </div>
              </div>

              {/* Instrumentos-Usuarios */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                <h4 className="font-bold text-slate-800 mb-2">🔗 Instrumentos-Usuarios</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white border border-green-200 rounded-xl px-3 py-2">
                    Insertadas: <span className="font-bold text-green-700">{getVal(result.resultados.instrumentos_usuarios, 'insertados', 'insertadas')}</span>
                  </div>
                  <div className="bg-white border border-red-200 rounded-xl px-3 py-2">
                    Errores: <span className="font-bold text-red-700">{result.resultados.instrumentos_usuarios.errores ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tips/ayuda */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-3 rounded-xl shadow-sm flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-blue-900 mb-1">Instrucciones</h4>
              <ul className="list-disc ml-5 text-sm text-blue-800 space-y-1">
                <li>Descargá la plantilla, completá las 4 hojas y guardá el archivo.</li>
                <li>Arrastrá el Excel a la zona de carga o hacé clic para seleccionarlo.</li>
                <li>Presioná “Importar Datos” y revisá el resumen de la importación.</li>
                <li>Eventos e instrumentos deben existir previamente en la base de datos.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}