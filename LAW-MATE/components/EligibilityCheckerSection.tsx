import React, { useState, useMemo, useEffect } from 'react';
import type { EligibilityCriteria, GovScheme, Scholarship } from '../types';
import { MOCK_GOV_SCHEMES, MOCK_SCHOLARSHIPS, STATES_LIST, SOCIAL_CATEGORIES_LIST, EDUCATION_LEVELS_LIST, OCCUPATION_CATEGORIES_LIST } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

type ActiveTab = 'schemes' | 'scholarships';

const SchemeCard: React.FC<{ scheme: GovScheme }> = ({ scheme }) => (
    <Card className="p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-start gap-4 mb-4">
            <div className="bg-primary-dark/10 p-3 rounded-lg">
                <scheme.icon className="h-8 w-8 text-primary-dark" />
            </div>
            <div>
                <h4 className="font-bold text-lg text-primary-dark">{scheme.name}</h4>
                <p className="text-xs font-semibold text-text-secondary">{scheme.ministry}</p>
            </div>
        </div>
        <p className="text-sm text-text-secondary flex-grow mb-4">{scheme.description}</p>
        <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Benefits</h5>
            <ul className="space-y-1 list-disc list-inside text-sm text-text-secondary">
                {scheme.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
        </div>
        <Button 
            variant="ghost" 
            className="mt-6 w-full"
            onClick={() => window.open(scheme.officialLink, '_blank', 'noopener,noreferrer')}
        >
            Visit Official Site &rarr;
        </Button>
    </Card>
);

const ScholarshipCard: React.FC<{ scholarship: Scholarship }> = ({ scholarship }) => (
    <Card className="p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-start gap-4 mb-4">
            <div className="bg-accent/10 p-3 rounded-lg">
                <scholarship.icon className="h-8 w-8 text-accent" />
            </div>
            <div>
                <h4 className="font-bold text-lg text-accent-dark">{scholarship.name}</h4>
                <p className="text-xs font-semibold text-text-secondary">{scholarship.provider}</p>
            </div>
        </div>
        <p className="text-sm text-text-secondary flex-grow mb-4">{scholarship.description}</p>
        <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Amount / Award</h5>
            <p className="text-sm font-semibold text-text">{scholarship.amount}</p>
        </div>
        <Button 
            variant="ghost"
            className="mt-6 w-full text-accent-dark hover:bg-accent/10"
            onClick={() => window.open(scholarship.officialLink, '_blank', 'noopener,noreferrer')}
        >
            Visit Official Site &rarr;
        </Button>
    </Card>
);


export const EligibilityCheckerSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
        const hash = window.location.hash.slice(1);
        return (hash === 'schemes' || hash === 'scholarships') ? hash : 'schemes';
    });
    const [criteria, setCriteria] = useState<EligibilityCriteria>({
        annualIncome: '',
        category: '',
        state: '',
        educationLevel: '',
        fieldOfStudy: '',
        occupation: '',
    });
    const [resultsVisible, setResultsVisible] = useState(false);

    useEffect(() => {
        const handlePopState = () => {
            const hash = window.location.hash.slice(1);
            const newTab = (hash === 'schemes' || hash === 'scholarships') ? hash : 'schemes';
            if (activeTab !== newTab) {
                setActiveTab(newTab);
                setResultsVisible(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [activeTab]);

    const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCriteria(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setResultsVisible(false); // Hide old results when criteria change
    };

    const handleCheckEligibility = () => {
        setResultsVisible(true);
    };

    const filteredSchemes = useMemo(() => {
        const income = parseFloat(criteria.annualIncome);
        return MOCK_GOV_SCHEMES.filter(scheme => {
            const crit = scheme.eligibilityCriteria;
            if (!isNaN(income) && crit.maxAnnualIncome && income > crit.maxAnnualIncome) return false;
            if (criteria.category && crit.categories && !crit.categories.includes(criteria.category)) return false;
            if (criteria.state && crit.states !== 'All' && !crit.states?.includes(criteria.state)) return false;
            if (criteria.occupation && crit.occupations && !crit.occupations.includes(criteria.occupation)) return false;
            return true;
        });
    }, [criteria]);

    const filteredScholarships = useMemo(() => {
        const income = parseFloat(criteria.annualIncome);
        return MOCK_SCHOLARSHIPS.filter(scholarship => {
            const crit = scholarship.eligibilityCriteria;
            if (!isNaN(income) && crit.maxAnnualIncome && income > crit.maxAnnualIncome) return false;
            if (criteria.category && crit.categories && !crit.categories.includes(criteria.category)) return false;
            if (criteria.state && crit.states !== 'All' && !crit.states?.includes(criteria.state)) return false;
            if (criteria.educationLevel && !crit.educationLevel.includes(criteria.educationLevel)) return false;
            if (criteria.fieldOfStudy && crit.fieldOfStudy && !crit.fieldOfStudy.some(f => f.toLowerCase().includes(criteria.fieldOfStudy.toLowerCase()))) return false;
            return true;
        });
    }, [criteria]);

    const TabButton: React.FC<{ tab: ActiveTab, children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => {
                if (activeTab !== tab) {
                    window.history.pushState({ tab }, '', `#${tab}`);
                    setActiveTab(tab);
                    setResultsVisible(false);
                }
            }}
            className={`w-1/2 py-4 px-1 text-center text-base font-semibold border-b-4 transition-colors duration-300 ${activeTab === tab ? 'border-primary-dark text-primary-dark' : 'border-transparent text-text-secondary hover:border-gray-300'}`}
        >
            {children}
        </button>
    );

    const FormField: React.FC<{ children: React.ReactNode, label: string }> = ({ label, children }) => (
        <div>
            <label className="block text-sm font-semibold text-text mb-2">{label}</label>
            {children}
        </div>
    )

    return (
        <section id="eligibility-checker-section" className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-dark font-heading">Eligibility Checker</h2>
                    <p className="text-lg text-text-secondary mt-3 max-w-3xl mx-auto">Discover government schemes and scholarships you might be eligible for.</p>
                </div>
                <Card className="max-w-4xl mx-auto">
                    <div className="flex">
                        <TabButton tab="schemes">Government Schemes</TabButton>
                        <TabButton tab="scholarships">Scholarships</TabButton>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                           <FormField label="Annual Family Income (₹)">
                                <input type="number" name="annualIncome" value={criteria.annualIncome} onChange={handleCriteriaChange} className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-light" placeholder="e.g., 250000" />
                            </FormField>
                             <FormField label="Social Category">
                                <select name="category" value={criteria.category} onChange={handleCriteriaChange} className="w-full p-3 border border-border rounded-lg bg-white appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                                    <option value="">Any</option>
                                    {SOCIAL_CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </FormField>
                            <FormField label="State / Union Territory">
                                <select name="state" value={criteria.state} onChange={handleCriteriaChange} className="w-full p-3 border border-border rounded-lg bg-white appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                                    <option value="">Any State</option>
                                    {STATES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </FormField>
                            {activeTab === 'schemes' && (
                                <FormField label="Occupation">
                                    <select name="occupation" value={criteria.occupation} onChange={handleCriteriaChange} className="w-full p-3 border border-border rounded-lg bg-white appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                                        <option value="">Any</option>
                                        {OCCUPATION_CATEGORIES_LIST.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </FormField>
                            )}
                            {activeTab === 'scholarships' && (
                                <>
                                    <FormField label="Education Level">
                                        <select name="educationLevel" value={criteria.educationLevel} onChange={handleCriteriaChange} className="w-full p-3 border border-border rounded-lg bg-white appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                                            <option value="">Any Level</option>
                                            {EDUCATION_LEVELS_LIST.map(e => <option key={e} value={e}>{e}</option>)}
                                        </select>
                                    </FormField>
                                    <div className="md:col-span-2">
                                        <FormField label="Field of Study (Optional)">
                                            <input type="text" name="fieldOfStudy" value={criteria.fieldOfStudy} onChange={handleCriteriaChange} className="w-full p-3 border border-border rounded-lg" placeholder="e.g., Engineering, Medicine" />
                                        </FormField>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="text-center">
                            <Button variant="primary" className="px-10 py-3 text-base" onClick={handleCheckEligibility}>Check Eligibility</Button>
                        </div>
                    </div>
                </Card>

                {resultsVisible && (
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold text-center mb-2">
                           {activeTab === 'schemes' ? `${filteredSchemes.length} Scheme(s) Found` : `${filteredScholarships.length} Scholarship(s) Found`}
                        </h3>
                         <p className="text-text-secondary text-center mb-8">Based on the criteria you provided.</p>

                        {activeTab === 'schemes' && (
                            filteredSchemes.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredSchemes.map(s => <SchemeCard key={s.id} scheme={s} />)}
                                </div>
                            ) : (
                                <Card className="text-center text-text-secondary p-8">No matching government schemes found for your criteria.</Card>
                            )
                        )}
                        {activeTab === 'scholarships' && (
                            filteredScholarships.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredScholarships.map(s => <ScholarshipCard key={s.id} scholarship={s} />)}
                                </div>
                            ) : (
                                <Card className="text-center text-text-secondary p-8">No matching scholarships found for your criteria.</Card>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};