import React from 'react';

// FIX: Extend CardProps with React.HTMLAttributes to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-surface rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden transition-all duration-300 ${className}`} {...props}>
      {children}
    </div>
  );
};