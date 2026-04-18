import React from 'react';
import type { PastIncidentAnalysisResult, HistoricalAnalysis, KeyChange, TimelineEvent } from '../types';

const AnalysisColumn: React.FC<{ title: string; analysis: HistoricalAnalysis }> = ({ title, analysis }) => (
    <div className="p-6 rounded-2xl bg-white/50 border border-white/40 h-full">
        <h3 className="text-xl font-bold text-primary-dark font-heading mb-4">{title}</h3>
        <div>
            <h4 className="font-semibold text-text mb-2">Applicable Laws</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
                {analysis.applicableLaws.map((law, i) => (
                    <li key={i} className="p-3 bg-slate-50 rounded-lg border border-border">
                        <strong className="text-primary-dark">{law.lawCode}</strong>: {law.relevance}
                    </li>
                ))}
            </ul>
        </div>
        <div className="mt-6">
            <h4 className="font-semibold text-text mb-2">User Rights</h4>
            <ul className="space-y-2 text-sm text-text-secondary list-disc list-inside">
                {analysis.userRights.map((right, i) => <li key={i}>{right}</li>)}
            </ul>
        </div>
    </div>
);

const Timeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => (
    <div>
        <h3 className="text-xl font-bold text-primary-dark font-heading mb-6 text-center">Legal Timeline</h3>
        <div className="relative pl-6">
            <div className="absolute left-9 top-2 bottom-2 w-0.5 bg-border rounded"></div>
            {events.map((event, index) => (
                <div key={index} className="flex items-center mb-6 relative">
                    <div className="absolute left-0 bg-primary-dark text-white rounded-full h-8 w-18 flex items-center justify-center font-bold text-sm z-10 px-2 shadow-lg">
                        {event.year}
                    </div>
                    <p className="ml-24 text-sm text-text-secondary">{event.event}</p>
                </div>
            ))}
        </div>
    </div>
);

export const PastIncidentAnalysisReport: React.FC<{ result: PastIncidentAnalysisResult }> = ({ result }) => {
    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-2xl font-bold text-primary-dark font-heading mb-2">Analysis Report</h2>
                <p className="text-sm text-text-secondary bg-blue-50/70 p-4 rounded-xl border border-primary-light/20">
                    <strong>Incident Summary:</strong> {result.incidentSummary}
                </p>
            </div>
            
            <Timeline events={result.timeline} />

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <AnalysisColumn title="Legal View (Then)" analysis={result.analysisThen} />
                <AnalysisColumn title="Legal View (Now)" analysis={result.analysisNow} />
            </div>

            <div>
                <h3 className="text-xl font-bold text-primary-dark font-heading mb-4">Key Changes & Impact</h3>
                <div className="space-y-4">
                    {result.keyChanges.map((change, i) => (
                        <div key={i} className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
                            <h4 className="font-semibold text-accent-dark">{change.changeTitle}</h4>
                            <p className="text-sm text-text-secondary mt-1">{change.changeDescription}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
