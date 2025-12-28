import React from 'react';

export const PRIMARY_BLUE = "text-blue-500";

const Button = ({ children, variant, size, className, ...props }) => {
  let baseStyles = "font-medium rounded-full transition duration-150 ease-in-out shadow-md";
  let variantStyles = "";
  let sizeStyles = "";

  switch (variant) {
    case 'primary':
      variantStyles = "bg-blue-600 text-white hover:bg-blue-700";
      break;
    case 'secondary':
      variantStyles = "bg-purple-600 text-white hover:bg-purple-700";
      break;
    case 'accent':
      variantStyles = "bg-yellow-500 text-slate-900 hover:bg-yellow-600";
      break;
    case 'outline':
      variantStyles = "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700";
      break;
    default:
      variantStyles = "bg-blue-600 text-white hover:bg-blue-700";
  }

  switch (size) {
    case 'sm':
      sizeStyles = "px-3 py-1.5 text-sm";
      break;
    case 'xs':
      sizeStyles = "px-2 py-1 text-xs";
      break;
    default:
      sizeStyles = "px-5 py-2.5";
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
