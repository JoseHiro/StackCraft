import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  onClick,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 whitespace-nowrap transition text-white font-medium shadow-md cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
