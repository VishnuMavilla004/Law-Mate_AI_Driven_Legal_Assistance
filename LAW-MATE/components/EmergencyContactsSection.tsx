import React from 'react';
import { MOCK_EMERGENCY_CONTACTS } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const EmergencyContactsSection: React.FC = () => {
  return (
    <section id="emergency-contacts-section" className="py-20 bg-red-50/50 rounded-3xl mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 font-heading">Quick Emergency Contacts</h2>
          <p className="text-lg text-red-700/80 mt-3 max-w-3xl mx-auto">In case of immediate danger, use these national helpline numbers.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {MOCK_EMERGENCY_CONTACTS.map(contact => (
            <Card key={contact.id} className="text-center flex flex-col items-center p-6 bg-white hover:-translate-y-2 hover:shadow-xl border-red-200/50">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <contact.icon className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900">{contact.serviceName}</h3>
              <p className="text-4xl font-extrabold text-primary-dark my-2 font-heading tracking-wider">{contact.number}</p>
              <p className="text-sm text-text-secondary mt-2 flex-grow min-h-[60px]">{contact.description}</p>
              <a href={`tel:${contact.number}`} className="w-full mt-6">
                <Button variant="warning" className="w-full">
                  Call Now
                </Button>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};