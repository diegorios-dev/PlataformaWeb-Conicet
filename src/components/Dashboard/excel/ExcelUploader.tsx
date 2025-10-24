import { useState } from "react";
import axios from "axios";
import { Upload, CheckCircle, XCircle } from "lucide-react";

export default function ExcelUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("excel", file);

      await axios.post("http://localhost:8000/api/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Subir Excel de Datos</h2>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500/10 file:text-emerald-700 hover:file:bg-emerald-500/20 cursor-pointer"
        />

        {file && (
          <p className="text-sm text-slate-700">📄 {file.name}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading"}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {status === "uploading" ? "Subiendo..." : "Subir"}
        </button>

        {status === "success" && (
          <div className="flex items-center gap-2 text-emerald-700 mt-2">
            <CheckCircle className="w-5 h-5" /> <span>Datos cargados correctamente</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600 mt-2">
            <XCircle className="w-5 h-5" /> <span>Error al subir el archivo</span>
          </div>
        )}
      </div>
    </div>
  );
}
