import { useState } from "react";
import { User, Save, X, CheckCircle2, AlertTriangle } from "lucide-react";
import type { FormEditUserProps } from "../../types";
import { useUserFormState } from "../../hooks";
import {
  assignInstrumentToUser,
  removeInstrumentFromUser
} from "@features/user/services";
import { UserBasicInfoForm } from "./UserBasicInfoForm";
import { UserSiteSelector } from "./UserSiteSelector";
import { UserInstrumentsManager } from "./UserInstrumentsManager";

export const FormEditUser = ({
  selectedUser,
  setSelectedUser,
  setShowEditModal,
  saveUser,
  onSave
}: FormEditUserProps) => {
  const [pendingAddInstruments, setPendingAddInstruments] = useState<number[]>([]);
  const [pendingRemoveInstruments, setPendingRemoveInstruments] = useState<number[]>([]);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState<string>("");

  const {
    sitios,
    zonaSeleccionada,
    setZonaSeleccionada,
    allInstruments,
    userInstruments,
    setUserInstruments,
    loadingInstruments
  } = useUserFormState({ selectedUser });

  const showModal = (type: "success" | "error", message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);

    setTimeout(() => {
      setModalOpen(false);
      if (type === "success") {
        setShowEditModal(false);
        onSave?.();
      }
    }, 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const u = {
        ...selectedUser,
        zona_id: zonaSeleccionada?.id ?? selectedUser.zona_id
      };

      await saveUser(u);

      for (const id of pendingAddInstruments) {
        await assignInstrumentToUser(selectedUser.id, id);
      }

      for (const id of pendingRemoveInstruments) {
        await removeInstrumentFromUser(selectedUser.id, id);
      }

      setPendingAddInstruments([]);
      setPendingRemoveInstruments([]);

      showModal("success", "Usuario actualizado correctamente");
    } catch (e) {
      showModal("error", "Error al actualizar usuario");
    }
    setIsSaving(false);
  };

  const handleAddInstrument = () => {
    if (!selectedInstrumentId) return;

    const id = parseInt(selectedInstrumentId);
    const instrument = allInstruments.find((i) => i.id === id);
    if (!instrument) return;

    setPendingAddInstruments((p) => [...p, id]);
    setUserInstruments([...userInstruments, instrument]);
    setSelectedInstrumentId("");
  };

  const handleRemoveInstrument = (id: number) => {
    setPendingRemoveInstruments((p) => [...p, id]);
    setUserInstruments(userInstruments.filter((i) => i.id !== id));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/25 backdrop-blur-md z-50">
      <div className="bg-white rounded-xl border border-blue-100 shadow-2xl max-w-4xl w-full p-0 overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex items-center gap-3">
          <div className="bg-white/30 rounded-full p-2">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-sans">Editar Usuario</h2>
            <p className="text-blue-100 text-xs font-sans">Actualiza la información del usuario</p>
          </div>
          <button
            className="ml-auto bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            onClick={() => setShowEditModal(false)}
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Body grid */}
        <div className="px-6 py-6 font-sans grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1: Info personal y ubicación */}
          <div className="space-y-6">
            <UserBasicInfoForm
              user={selectedUser}
              onUserChange={setSelectedUser}
              disabled={isSaving}
            />

            <UserSiteSelector
              user={selectedUser}
              sitios={sitios}
              zonaSeleccionada={zonaSeleccionada}
              onZonaChange={setZonaSeleccionada}
              onUserChange={setSelectedUser}
              disabled={isSaving}
            />
          </div>

          {/* Columna 2: Instrumentos y acciones */}
          <div className="space-y-6 flex flex-col h-full">
            <UserInstrumentsManager
              userInstruments={userInstruments}
              allInstruments={allInstruments}
              selectedInstrumentId={selectedInstrumentId}
              onSelectedInstrumentChange={setSelectedInstrumentId}
              onAddInstrument={handleAddInstrument}
              onRemoveInstrument={handleRemoveInstrument}
              loadingInstruments={loadingInstruments}
              disabled={isSaving}
            />

            {/* Footer solo en columna 2 */}
            <div className="bg-white border-t border-blue-100 px-0 py-4 flex justify-end gap-3">
              <button
                className="px-5 py-2 bg-white border border-blue-100 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 text-sm"
                onClick={() => setShowEditModal(false)}
              >
                <X size={16} /> Cancelar
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 text-sm"
                onClick={handleSave}
              >
                <Save size={16} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        {/* Spinner overlay al guardar */}
        {isSaving && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 flex flex-col items-center shadow-2xl">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-base font-semibold text-blue-700">Guardando cambios...</span>
            </div>
          </div>
        )}

        {/* Modal de éxito/error */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100]">
            <div className="bg-white rounded-xl p-4 text-center max-w-xs shadow-xl">
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${modalType === "success" ? "bg-green-100" : "bg-red-100"}`}
              >
                {modalType === "success" ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <p className="text-base font-semibold">{modalMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormEditUser;
