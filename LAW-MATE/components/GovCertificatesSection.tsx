import React, { useState } from 'react';
import { MOCK_GOV_CERTIFICATES } from '../constants';
import type { GovCertificate } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CertificateRoadmapModal } from './CertificateRoadmapModal';

export const GovCertificatesSection: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<GovCertificate | null>(null);

  return (
    <section id="gov-certificates-section" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark font-heading">Government Services & Certificates</h2>
          <p className="text-lg text-text-secondary mt-3 max-w-3xl mx-auto">Step-by-step guides to obtaining essential government documents.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {MOCK_GOV_CERTIFICATES.map(cert => (
            <Card key={cert.id} className="text-left flex flex-col p-6 hover:-translate-y-2 hover:shadow-xl">
                <div className="bg-primary-dark/10 p-3 rounded-full mb-5 w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-text-primary">{cert.name}</h3>
                    <p className="text-sm text-text-secondary mt-2 mb-4">{cert.description}</p>
                </div>
                <Button variant="ghost" className="mt-4 text-sm py-2 px-4 w-full justify-start" onClick={() => setSelectedCertificate(cert)}>
                    View Application Guide
                </Button>
            </Card>
          ))}
        </div>
      </div>
      {selectedCertificate && (
        <CertificateRoadmapModal 
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </section>
  );
};