
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, className, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <select
        id={id}
        className={`w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
