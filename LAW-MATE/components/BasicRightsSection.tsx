import React from 'react';
import { MOCK_BASIC_RIGHTS } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const BasicRightsSection: React.FC = () => {
  return (
    <section id="basic-rights-section" className="py-20 bg-white mt-12 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark font-heading">Know Your Basic Rights</h2>
            <p className="text-lg text-text-secondary mt-3 max-w-3xl mx-auto">Understanding your fundamental and human rights is the first step to justice.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_BASIC_RIGHTS.map(right => (
            <Card key={right.id} className="text-center flex flex-col items-center p-8 hover:-translate-y-2 hover:shadow-xl">
                <div className="bg-accent/10 p-4 rounded-full mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary">{right.name}</h3>
                <p className="text-sm text-text-secondary mt-2 flex-grow">{right.descriptionSimple}</p>
                <Button variant="ghost" className="mt-6 text-sm py-2 px-4">
                    Learn More
                </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};