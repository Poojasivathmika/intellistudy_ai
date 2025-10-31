
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      <input
        id={id}
        className={`w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-brand-light placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
