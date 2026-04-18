
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'red' | 'yellow' | 'green';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'green', className = '' }) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-800 border-red-300',
    yellow: 'bg-warning-light text-warning-dark border-yellow-300',
    green: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};
