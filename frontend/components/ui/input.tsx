import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-5 py-3 rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition ${className}`}
      {...props}
    />
  );
};

export default Input;
