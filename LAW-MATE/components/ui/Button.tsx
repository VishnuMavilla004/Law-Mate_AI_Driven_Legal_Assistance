import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'subtle' | 'warning';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none px-5 py-3';

  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary-light to-primary-dark text-white hover:opacity-90 focus-visible:ring-primary-dark shadow-lg shadow-primary/30 transform-gpu hover:scale-[1.02]',
    secondary: 'bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent shadow-sm',
    ghost: 'bg-transparent text-primary-dark hover:bg-primary-dark/10 focus-visible:ring-primary-dark',
    subtle: 'bg-slate-100 text-text-secondary hover:bg-slate-200 focus-visible:ring-slate-400',
    warning: 'bg-warning text-white hover:bg-warning/90 focus-visible:ring-warning shadow-sm',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};