export default function HistogramaError({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
      <p className="text-center text-red-600 font-medium">Error: {error}</p>
    </div>
  );
}
