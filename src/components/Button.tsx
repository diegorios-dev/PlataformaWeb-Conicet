import React from "react";

interface ButtonBackProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonBackProps> = ({ onClick , children = "Volver", className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
