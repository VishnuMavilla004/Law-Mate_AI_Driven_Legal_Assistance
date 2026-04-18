import React from 'react';
import { MOCK_LAW_UPDATES } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const NewLawsSection: React.FC = () => {
  return (
    <section id="new-laws-section" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark font-heading">What's New in Law</h2>
            <p className="text-lg text-text-secondary mt-3 max-w-2xl mx-auto">Stay informed about recent legal updates, amendments, and landmark judgements.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_LAW_UPDATES.map(update => (
            <Card key={update.id} className="flex flex-col p-8 hover:-translate-y-2 hover:shadow-xl">
                <div className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                    {update.tags.map(tag => (
                    <span key={tag} className="text-xs font-semibold bg-blue-100 text-primary-dark px-3 py-1 rounded-full">
                        {tag}
                    </span>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-text-primary">{update.title}</h3>
                <p className="text-sm text-text-secondary mt-3 mb-4">{update.summary}</p>
                </div>
                <p className="text-xs text-gray-500 mt-auto pt-4 border-t border-border">Effective: {update.effectiveDate}</p>
            </Card>
            ))}
        </div>
        <div className="text-center mt-16">
            <Button variant="ghost" className="text-base px-6 py-3">View All Updates</Button>
        </div>
      </div>
    </section>
  );
};