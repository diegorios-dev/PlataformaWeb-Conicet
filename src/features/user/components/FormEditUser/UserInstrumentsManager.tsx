import { Wrench, Plus, Trash2, Settings } from "lucide-react";
import type { Instrument } from "../../types";
import { CustomSelect } from "@shared/ui/molecules/CustomSelect";

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
        <h3 className="font-semibold  text-base">Instrumentos</h3>
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
                    <Trash2 size={18} className="text-black-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 bg-blue-50 border border-blue-200 p-3 rounded-lg flex gap-2">
            <div className="flex-1">
              <CustomSelect
                options={allInstruments
                  .filter(i => !userInstruments.some(u => u.id === i.id))
                  .map((i) => ({
                    value: String(i.id),
                    label: i.name,
                    subtitle: `${i.brand} ${i.model}`,
                    icon: <Settings className="w-4 h-4" />
                  }))}
                value={selectedInstrumentId}
                onChange={(value) => onSelectedInstrumentChange(String(value))}
                placeholder="Seleccionar instrumento"
                icon={<Wrench className="w-5 h-5" />}
                disabled={disabled}
              />
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
              onClick={onAddInstrument}
              disabled={disabled || !selectedInstrumentId || userInstruments.some(u => u.id === parseInt(selectedInstrumentId))}
            >
              <Plus size={16} />
              Agregar
            </button>
          </div>
        </>
      )}
    </section>
  );
};
