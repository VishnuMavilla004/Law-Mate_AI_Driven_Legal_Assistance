import React from 'react';
import { Logo } from './ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-20 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
                <Logo className="h-8 w-8 text-primary-dark"/>
                <span className="ml-2 text-3xl font-bold text-primary-dark font-heading">LawMate</span>
            </div>
            <p className="text-sm text-text-secondary max-w-lg mx-auto mb-8">
                Your intelligent legal rights companion. Understand your rights in minutes, not months.
            </p>
        </div>
        <div className="max-w-4xl mx-auto">
            <p className="text-xs text-text-secondary bg-slate-100 p-4 rounded-xl border border-border">
                <strong>Disclaimer:</strong> LawMate provides AI-generated legal information for educational purposes only. It is not a substitute for professional legal advice from a qualified lawyer. Always consult a legal professional for serious matters. For any critical issues, please contact a certified legal practitioner.
            </p>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-text-secondary">&copy; {new Date().getFullYear()} LawMate. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};