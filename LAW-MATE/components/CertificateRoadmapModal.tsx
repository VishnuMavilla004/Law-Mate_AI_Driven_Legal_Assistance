import React from 'react';
import type { GovCertificate } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface CertificateRoadmapModalProps {
  certificate: GovCertificate;
  onClose: () => void;
}

export const CertificateRoadmapModal: React.FC<CertificateRoadmapModalProps> = ({ certificate, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside the card
      >
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark font-heading">Roadmap: {certificate.name}</h2>
              <p className="text-sm text-text-secondary">{certificate.description}</p>
              {certificate.officialLink && (
                  <Button 
                    variant="secondary" 
                    className="mt-4 text-sm py-2 px-4"
                    onClick={() => window.open(certificate.officialLink, '_blank', 'noopener,noreferrer')}
                  >
                    Visit Official Portal
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Button>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="space-y-8">
            {certificate.roadmap.map((step, index) => (
              <div key={step.stepNumber} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-primary-dark text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg z-10">
                    {step.stepNumber}
                  </div>
                  {index < certificate.roadmap.length - 1 && (
                    <div className="w-0.5 flex-grow bg-border -mt-1"></div>
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="font-bold text-lg text-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-border mt-auto text-right">
            <Button variant="subtle" onClick={onClose}>Close</Button>
        </div>
      </Card>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};