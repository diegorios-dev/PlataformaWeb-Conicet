import { X } from 'lucide-react';
import type { ChangeEvent } from 'react';

export interface AudioInputProps {
  onAudioChange: (file: File | null) => void;
  audioFile?: File | null;
  accept?: string;
  className?: string;
}

export const AudioInput = ({
  onAudioChange,
  audioFile,
  accept = 'audio/*',
  className = '',
}: AudioInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAudioChange(file);
    }
  };

  const handleRemove = () => {
    onAudioChange(null);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
      />
      {audioFile && (
        <div className="flex items-center justify-between bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <span className="text-sm font-semibold text-red-700">
            {audioFile.name}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
