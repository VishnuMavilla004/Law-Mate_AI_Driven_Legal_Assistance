import React, { useState } from 'react';
import { analyzePastIncident } from '../services/geminiService';
import type { PastIncidentAnalysisResult } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PastIncidentAnalysisReport } from './PastIncidentAnalysisReport';

export const PastIncidentAnalyzer: React.FC = () => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [result, setResult] = useState<PastIncidentAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !date) {
            setError("Please provide both a description and an approximate date.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const analysisResult = await analyzePastIncident(description, date);
            setResult(analysisResult);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="past-incident-analyzer-section" className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-dark font-heading">Past Incident Analyzer</h2>
                <p className="text-lg text-text-secondary mt-3 max-w-3xl mx-auto">
                    Describe a past incident to see how current laws and rights might have changed the outcome.
                </p>
            </div>
            <Card className="max-w-4xl mx-auto p-8">
                {!result && !isLoading && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="incident-description" className="block text-sm font-semibold text-text mb-2">
                                Describe the Past Incident
                            </label>
                            <textarea
                                id="incident-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-light bg-white"
                                placeholder="e.g., I faced online harassment in 2018 where my personal photos were shared without consent..."
                            />
                        </div>
                        <div>
                            <label htmlFor="incident-date" className="block text-sm font-semibold text-text mb-2">
                                Approximate Date of Incident
                            </label>
                            <input
                                type="date"
                                id="incident-date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full md:w-1/2 p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-light bg-white"
                            />
                        </div>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <div className="text-center pt-4">
                            <Button type="submit" variant="primary" disabled={isLoading} className="px-8 py-3">
                                Analyze Then vs. Now
                            </Button>
                        </div>
                    </form>
                )}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[200px]">
                         <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-text-secondary mt-4">Analyzing historical legal data...</p>
                    </div>
                )}
                {result && (
                    <div>
                        <PastIncidentAnalysisReport result={result} />
                        <div className="text-center mt-8">
                            <Button variant="subtle" onClick={() => {
                                setResult(null);
                                setDescription('');
                                setDate('');
                            }}>
                                Analyze Another Incident
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </section>
    );
};