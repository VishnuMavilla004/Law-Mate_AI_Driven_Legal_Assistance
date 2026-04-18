import React, { useState } from 'react';
import type { AnalysisResult, LawSuggestion, DocumentType } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { Button } from './ui/Button';

interface InfoPanelProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  onGenerateDocument: (docType: DocumentType) => void;
}

const severityColorMap = {
  Low: 'green',
  Medium: 'yellow',
  High: 'red',
} as const;

const LawSuggestionCard: React.FC<{ law: LawSuggestion }> = ({ law }) => (
    <div className="p-4 border border-border/80 rounded-lg bg-white mb-3 transition-shadow hover:shadow-md hover:border-primary-light/50">
        <h4 className="font-bold text-primary-dark">{law.code}, {law.act}</h4>
        <p className="text-sm font-semibold text-text-secondary mb-2">{law.title}</p>
        <p className="text-xs text-text-secondary mb-3">{law.simpleExplanation}</p>
        <p className="text-xs text-red-700 font-medium"><strong>Punishment:</strong> {law.punishment}</p>
    </div>
);

const InfoPanelSkeleton: React.FC = () => (
    <Card className="h-full p-6">
        <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="flex border-b border-border mb-6">
                <div className="h-9 bg-slate-200 rounded-t-lg w-24 mr-2"></div>
                <div className="h-9 bg-slate-200 rounded-t-lg w-24 mr-2"></div>
                <div className="h-9 bg-slate-200 rounded-t-lg w-24"></div>
            </div>
            <div className="space-y-4">
                <div className="h-28 bg-slate-200 rounded-lg"></div>
                <div className="h-36 bg-slate-200 rounded-lg"></div>
            </div>
        </div>
    </Card>
);

const InfoPanelEmptyState: React.FC = () => (
    <Card className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 border-dashed">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="font-bold text-xl text-text font-heading">AI Analysis Panel</h3>
        <p className="text-sm text-text-secondary mt-2 max-w-xs">
          Your case summary, relevant laws, and next steps will appear here once LawMate analyzes your situation.
        </p>
    </Card>
);

type Tab = 'summary' | 'laws' | 'steps' | 'ml_insights';

export const InfoPanel: React.FC<InfoPanelProps> = ({ result, isLoading, onGenerateDocument }) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  if (isLoading) return <InfoPanelSkeleton />;
  if (!result) return <InfoPanelEmptyState />;

  const TabButton: React.FC<{tab: Tab, children: React.ReactNode}> = ({tab, children}) => (
      <button onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 ${activeTab === tab ? 'text-primary-dark border-primary-dark' : 'text-text-secondary border-transparent hover:text-primary-dark hover:border-slate-300'}`}>
          {children}
      </button>
  );

  return (
    <Card className="h-full p-0">
        <div className="p-6">
            <h3 className="text-xl font-bold text-primary-dark mb-3 font-heading">Legal Analysis</h3>
            <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                    <h4 className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Severity</h4>
                    <Badge color={severityColorMap[result.severity]}>{result.severity}</Badge>
                </div>
                 <div>
                    <h4 className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">AI Legal Confidence</h4>
                    <div className="flex items-center gap-2">
                        <Progress value={result.confidence} />
                        <span className="text-sm font-bold text-accent-dark">{result.confidence}%</span>
                    </div>
                </div>
                {result.ml_category && (
                    <div>
                        <h4 className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Detected Category</h4>
                        <Badge color="blue">{result.ml_category.replace('_', ' ')}</Badge>
                        {result.ml_category_confidence && (
                            <span className="text-xs text-text-secondary ml-2">
                                ({Math.round(result.ml_category_confidence * 100)}% confidence)
                            </span>
                        )}
                    </div>
                )}
                {result.ml_severity_score && (
                    <div>
                        <h4 className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">ML Risk Score</h4>
                        <div className="flex items-center gap-2">
                            <Progress value={result.ml_severity_score * 100} />
                            <span className="text-sm font-bold text-accent-dark">
                                {result.ml_risk_level} ({Math.round(result.ml_severity_score * 100)}%)
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="border-b border-t border-border">
            <nav className="flex px-4">
                <TabButton tab="summary">Summary</TabButton>
                <TabButton tab="laws">Laws</TabButton>
                <TabButton tab="steps">Next Steps</TabButton>
                {(result.ml_category || result.similar_cases) && (
                    <TabButton tab="ml_insights">ML Insights</TabButton>
                )}
            </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-[48vh]">
            {activeTab === 'summary' && (
                <div>
                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">{result.summary}</p>
                    <div className="mt-4 p-4 bg-blue-50/70 border-l-4 border-primary-light rounded-r-lg">
                        <h5 className="font-semibold text-primary-dark text-sm">Confidence Reason</h5>
                        <p className="text-xs text-text-secondary mt-1">{result.confidenceReason}</p>
                    </div>
                </div>
            )}
            {activeTab === 'laws' && (
                <div className="space-y-3">
                    {result.lawSuggestions.map((law, i) => <LawSuggestionCard key={i} law={law} />)}
                </div>
            )}
            {activeTab === 'steps' && (
                 <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-primary-dark mb-2 font-heading">Your Rights</h3>
                        <ul className="space-y-2 list-disc list-inside text-sm text-text-secondary">
                            {result.rights.map((right, i) => <li key={i}>{right}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary-dark mb-2 font-heading">Suggested Next Steps</h3>
                         <ul className="space-y-2 list-decimal list-inside text-sm text-text-secondary">
                            {result.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-primary-dark mb-2 font-heading">Generate Document</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.documentSuggestions.map((doc, i) => (
                                <Button key={i} variant="secondary" className="text-xs py-2 px-3" onClick={() => onGenerateDocument(doc)}>
                                    Generate {doc}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'ml_insights' && (
                <div className="space-y-6">
                    {result.ml_category && (
                        <div>
                            <h3 className="text-lg font-bold text-primary-dark mb-2 font-heading">AI-Detected Legal Category</h3>
                            <div className="flex items-center gap-3">
                                <Badge color="blue" className="text-sm px-3 py-1">
                                    {result.ml_category.replace('_', ' ').toUpperCase()}
                                </Badge>
                                {result.ml_category_confidence && (
                                    <span className="text-sm text-text-secondary">
                                        Confidence: {Math.round(result.ml_category_confidence * 100)}%
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-text-secondary mt-2">
                                This category was automatically detected by our machine learning model to provide more targeted legal analysis.
                            </p>
                        </div>
                    )}

                    {result.ml_severity_score && (
                        <div>
                            <h3 className="text-lg font-bold text-primary-dark mb-2 font-heading">ML Risk Assessment</h3>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-semibold">Severity Score:</span>
                                <Badge color={result.ml_risk_level === 'High' ? 'red' : result.ml_risk_level === 'Medium' ? 'yellow' : 'green'}>
                                    {result.ml_risk_level}
                                </Badge>
                                <span className="text-sm text-text-secondary">
                                    ({Math.round(result.ml_severity_score * 100)}%)
                                </span>
                            </div>
                            <Progress value={result.ml_severity_score * 100} className="mb-2" />
                            <p className="text-xs text-text-secondary">
                                Machine learning assessment of case severity based on similar historical cases.
                            </p>
                        </div>
                    )}

                    {result.similar_cases && result.similar_cases.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-primary-dark mb-2 font-heading">Similar Cases</h3>
                            <div className="space-y-2">
                                {result.similar_cases.map((case_desc, i) => (
                                    <div key={i} className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-text-secondary">{case_desc}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-text-secondary mt-2">
                                These similar cases were found using AI-powered text similarity analysis.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </Card>
  );
};