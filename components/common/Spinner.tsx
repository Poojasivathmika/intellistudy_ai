
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-24 w-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8">
      <div className={`animate-spin rounded-full border-4 border-slate-500 border-t-brand-accent ${sizeClasses[size]}`}></div>
      {text && <p className="text-slate-300 text-lg animate-pulse">{text}</p>}
    </div>
  );
};

export default Spinner;
