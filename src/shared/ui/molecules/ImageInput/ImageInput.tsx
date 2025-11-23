import { X } from 'lucide-react';
import type { ChangeEvent } from 'react';

export interface ImageInputProps {
  onImageChange: (file: File | null) => void;
  imagePreview?: string;
  accept?: string;
  className?: string;
}

export const ImageInput = ({
  onImageChange,
  imagePreview,
  accept = 'image/*',
  className = '',
}: ImageInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 text-slate-700 font-medium transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
      />
      {imagePreview && (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded-xl border-2 border-slate-200 shadow-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 shadow-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
