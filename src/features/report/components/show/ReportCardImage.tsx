interface ReportCardImageProps {
  imageUrl?: string;
  onImageClick: () => void;
}

export const ReportCardImage = ({ imageUrl, onImageClick }: ReportCardImageProps) => {
  return (
    <div className="w-32 h-32 flex-shrink-0">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Reporte"
          onClick={onImageClick}
          className="w-full h-full object-cover rounded-2xl border-2 border-slate-200 shadow-lg hover:scale-101 transition-transform duration-300 cursor-pointer"
        />
      ) : (
        <div className="w-full h-full bg-slate-100 border-2 border-slate-200 rounded-2xl flex items-center justify-center">
          <span className="text-slate-400 text-xs">Sin imagen</span>
        </div>
      )}
    </div>
  );
};