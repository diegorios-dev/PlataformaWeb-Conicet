import { X } from "lucide-react";

interface ImageModalProps {
  open: boolean;
  image: string;
  onClose: () => void;
}

export const ImageModal = ({ open, image, onClose }: ImageModalProps) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
        <button
          onClick={onClose}
          aria-label="Cerrar imagen"
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 hover:scale-105 z-10"
        >
          <X size={24} />
        </button>
        <img
          src={image}
          alt="Imagen ampliada del reporte"
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};