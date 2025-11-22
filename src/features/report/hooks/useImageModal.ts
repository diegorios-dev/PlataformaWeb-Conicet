import { useState } from "react";

export const useImageModal = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");

  return {
    open,
    image,
    openModal: (img: string) => {
      setImage(img);
      setOpen(true);
    },
    closeModal: () => {
      setOpen(false);
      setImage("");
    }
  };
};
