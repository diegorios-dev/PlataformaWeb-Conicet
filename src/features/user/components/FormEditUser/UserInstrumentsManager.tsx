import { Wrench, Plus, Trash2 } from "lucide-react";
import type { Instrument } from "../../types";

interface UserInstrumentsManagerProps {
  userInstruments: Instrument[];
  allInstruments: Instrument[];
  selectedInstrumentId: string;
  onSelectedInstrumentChange: (id: string) => void;
  onAddInstrument: () => void;
  onRemoveInstrument: (id: number) => void;
  loadingInstruments: boolean;
  disabled?: boolean;
}

export const UserInstrumentsManager = ({
  userInstruments,
  allInstruments,
  selectedInstrumentId,
  onSelectedInstrumentChange,
  onAddInstrument,
  onRemoveInstrument,
  loadingInstruments,
  disabled = false
}: UserInstrumentsManagerProps) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-4 border border-purple-50 flex-1">
      <div className="flex items-center gap-2 mb-3">
        <Wrench className="text-purple-500" size={16} />
        <h3 className="font-semibold text-purple-700 text-base">Instrumentos</h3>
      </div>
      {loadingInstruments ? (
        <p className="text-gray-600 text-center text-sm">Cargando...</p>
      ) : (
        <>
          {userInstruments.length === 0 ? (
            <p className="text-gray-600 text-sm">No tiene instrumentos asignados.</p>
          ) : (
            <div className="space-y-2">
              {userInstruments.map((inst) => (
                <div
                  key={inst.id}
                  className="bg-white border border-blue-50 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <p className="font-bold text-xs text-gray-900">{inst.name}</p>
                    <p className="text-xs text-gray-500">
                      {inst.brand} {inst.model}
                    </p>
                  </div>
                  <button
                    className="p-2 bg-gray-100 text-red-500 rounded-md hover:bg-red-100 transition-all duration-200"
                    onClick={() => onRemoveInstrument(inst.id)}
                    disabled={disabled}
                    title="Quitar instrumento"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 bg-blue-50 border border-blue-200 p-2 rounded-md flex gap-2">
            <select
              className="w-full px-3 py-2 bg-white border border-blue-100 rounded-md text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-sans text-sm cursor-pointer"
              value={selectedInstrumentId}
              onChange={(e) => onSelectedInstrumentChange(e.target.value)}
              disabled={disabled}
            >
              <option value="">Seleccionar instrumento</option>
              {allInstruments
                .filter(i => !userInstruments.some(u => u.id === i.id))
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} — {i.brand}
                  </option>
                ))}
            </select>
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-200 text-sm"
              onClick={onAddInstrument}
              disabled={disabled || !selectedInstrumentId || userInstruments.some(u => u.id === parseInt(selectedInstrumentId))}
            >
              <Plus size={14} />
              Agregar
            </button>
          </div>
        </>
      )}
    </section>
  );
};
