import { useState } from "react";

export type ModalType = "success" | "error" | "warning" | "info";

interface UseModalReturn {
  isOpen: boolean;
  modalType: ModalType;
  modalMessage: string;
  showModal: (type: ModalType, message: string, autocloseMs?: number) => void;
  closeModal: () => void;
}

const useModal = (onClose?: () => void): UseModalReturn => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("success");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (type: ModalType, message: string, autocloseMs = 3000) => {
    setModalType(type);
    setModalMessage(message);
    setIsOpen(true);

    if (autocloseMs > 0) {
      setTimeout(() => {
        setIsOpen(false);
        if (onClose) {
          onClose();
        }
      }, autocloseMs);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return {
    isOpen,
    modalType,
    modalMessage,
    showModal,
    closeModal,
  };
};

export { useModal };
export default useModal;