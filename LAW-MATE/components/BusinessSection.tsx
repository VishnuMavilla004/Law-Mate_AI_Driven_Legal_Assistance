import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { MOCK_BUSINESS_LAWS, MOCK_BUSINESS_STRUCTURES, MOCK_REGISTRATION_PERKS } from '../constants';
import { LawyerConsultationModal } from './LawyerConsultationModal';

export const BusinessSection: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    return (
    <>
      <section id="business-section" className="py-20 bg-white mt-12 rounded-3xl">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-dark font-heading">LawMate for Business</h2>
                <p className="text-lg text-text-secondary mt-3 max-w-3xl mx-auto">Navigate the legal complexities of starting and running your business with confidence.</p>
            </div>

            {/* Business Structures */}
            <div className="mb-20">
                <h3 className="text-2xl font-bold text-text-primary mb-8 text-center">Choosing Your Business Structure</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {MOCK_BUSINESS_STRUCTURES.map(structure => (
                        <Card key={structure.id} className="text-center p-6 flex flex-col items-center hover:-translate-y-2 hover:shadow-xl">
                            <div className="bg-primary-dark/10 p-4 rounded-full mb-4">
                                <structure.icon className="h-10 w-10 text-primary-dark" />
                            </div>
                            <h4 className="font-bold text-lg text-primary-dark">{structure.name}</h4>
                            <p className="text-sm text-text-secondary mt-2 flex-grow">{structure.description}</p>
                            <p className="text-xs font-semibold bg-blue-100 text-primary-dark px-3 py-1 rounded-full mt-4">Best for: {structure.bestFor}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Registration Perks & Consultation CTA */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                <div>
                     <h3 className="text-2xl font-bold text-text-primary mb-6">Benefits of Registration</h3>
                     <div className="space-y-4">
                        {MOCK_REGISTRATION_PERKS.map(perk => (
                            <div key={perk.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50">
                                <div className="bg-accent/10 text-accent rounded-full p-2 flex-shrink-0">
                                    <perk.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text">{perk.title}</h4>
                                    <p className="text-sm text-text-secondary">{perk.description}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
                 <Card className="p-8 text-center bg-gradient-to-br from-primary-dark to-blue-900 text-white shadow-2xl shadow-blue-300">
                    <h3 className="text-2xl font-bold mb-3 font-heading">Need Expert Advice?</h3>
                    <p className="opacity-80 mb-6">Connect with a verified legal professional for a virtual consultation to resolve your specific business queries.</p>
                    <Button variant="secondary" className="px-8 py-3 text-base" onClick={() => setIsModalOpen(true)}>
                        Schedule a Consultation
                    </Button>
                </Card>
            </div>

             {/* Key Business Laws */}
            <div>
                <h3 className="text-2xl font-bold text-text-primary mb-8 text-center">Key Business Laws at a Glance</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {MOCK_BUSINESS_LAWS.map(law => (
                        <Card key={law.id} className="p-6">
                             <h4 className="font-bold text-lg text-primary-dark mb-2">{law.name}</h4>
                             <p className="text-sm text-text-secondary mb-4">{law.summary}</p>
                             <ul className="text-xs text-text-secondary space-y-1">
                                {law.keyAspects.map(aspect => <li key={aspect} className="flex items-start"><span className="text-accent mr-2 mt-1">&#10003;</span>{aspect}</li>)}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
      </section>
      {isModalOpen && <LawyerConsultationModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};