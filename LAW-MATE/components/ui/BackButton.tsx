import React from 'react';
import { Button } from './Button';

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  children?: React.ReactNode;
}

const ArrowLeftIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export const BackButton: React.FC<BackButtonProps> = ({ onClick, children, ...props }) => {
  return (
    <Button variant="ghost" onClick={onClick} className="pl-2 pr-4 text-text-secondary" {...props}>
      <ArrowLeftIcon className="h-5 w-5 mr-1" />
      {children || 'Back'}
    </Button>
  );
};
