
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  fullWidth = false
}) => {
  const baseStyles = "px-6 py-4 rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center text-lg";
  const variants = {
    primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-200",
    secondary: "bg-white text-gray-700 border border-gray-200 shadow-sm",
    danger: "bg-rose-500 text-white shadow-lg shadow-rose-200"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
