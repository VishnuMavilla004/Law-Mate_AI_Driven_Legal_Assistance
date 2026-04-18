import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface LawyerConsultationModalProps {
  onClose: () => void;
}

export const LawyerConsultationModal: React.FC<LawyerConsultationModalProps> = ({ onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        email: '',
        query: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log("Consultation Request:", formData);
        setSubmitted(true);
    };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-lg max-h-[90vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark font-heading">Book a Virtual Consultation</h2>
              <p className="text-sm text-text-secondary">Submit your query to connect with a legal expert.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto">
            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Your Name</label>
                        <input type="text" name="name" id="name" required onChange={handleChange} className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary-light focus:ring-primary-light sm:text-sm p-2" />
                    </div>
                     <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-text-secondary">Business Name (Optional)</label>
                        <input type="text" name="businessName" id="businessName" onChange={handleChange} className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary-light focus:ring-primary-light sm:text-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
                        <input type="email" name="email" id="email" required onChange={handleChange} className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary-light focus:ring-primary-light sm:text-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="query" className="block text-sm font-medium text-text-secondary">Brief Description of Your Query</label>
                        <textarea name="query" id="query" rows={4} required onChange={handleChange} className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary-light focus:ring-primary-light sm:text-sm p-2"></textarea>
                    </div>
                    <p className="text-xs text-text-secondary">A member of our legal network will contact you to schedule the consultation. Fees may apply.</p>
                    <div className="pt-4">
                        <Button type="submit" variant="primary" className="w-full">Request Consultation</Button>
                    </div>
                </form>
            ) : (
                <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-accent mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold text-text">Request Sent!</h3>
                    <p className="text-text-secondary mt-2">Thank you for reaching out. A legal expert will be in touch with you shortly via email.</p>
                    <Button variant="subtle" onClick={onClose} className="mt-6">Close</Button>
                </div>
            )}
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
