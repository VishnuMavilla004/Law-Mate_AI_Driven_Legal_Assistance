import React from 'react';

export type Category = 
  | 'Workplace Issues'
  | 'Women Safety'
  | 'Cybercrime & Online Fraud'
  | 'Consumer Complaints'
  | 'Education / College'
  | 'Property / Family'
  | 'Business & Corporate'
  | 'General / Other';

export type DocumentType = 'Complaint to ICC' | 'FIR Draft' | 'Legal Notice' | string;

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  analysis?: AnalysisResult;
  media?: {
    type: 'image';
    dataUrl: string;
  };
}

export interface UserDetails {
  fullName: string;
  address: string;
  contact: string;
  opponentName: string;
  opponentAddress: string;
}

export interface LawSuggestion {
  code: string;
  act: string;
  title: string;
  simpleExplanation: string;
  punishment: string;
  domainTags: string[];
}

export interface AnalysisResult {
  summary: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  confidenceReason?: string;
  lawSuggestions: LawSuggestion[];
  rights: string[];
  nextSteps: string[];
  documentSuggestions: DocumentType[];
  // ML-enhanced fields
  ml_category?: string;
  ml_category_confidence?: number;
  ml_severity_score?: number;
  ml_risk_level?: string;
  similar_cases?: string[];
}
}

export interface LawUpdate {
  id: string;
  title: string;
  summary: string;
  effectiveDate: string;
  tags: string[];
}

export interface BasicRight {
  id: string;
  name: string;
  descriptionSimple: string;
  category: string;
}

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface GovCertificate {
  id: string;
  name: string;
  description: string;
  keyDocuments: string[];
  validationInfo: string;
  roadmap: RoadmapStep[];
  officialLink?: string;
}

export interface EmergencyContact {
  id: string;
  serviceName: string;
  number: string;
  description: string;
  icon: React.FC<{className?: string}>;
}

// Types for the new Past Incident Analyzer feature
export interface HistoricalLaw {
  lawCode: string;
  description: string;
  relevance: string;
}

export interface HistoricalAnalysis {
  applicableLaws: HistoricalLaw[];
  userRights: string[];
}

export interface KeyChange {
  changeTitle: string;
  changeDescription: string;
}

export interface TimelineEvent {
    year: string;
    event: string;
}

export interface PastIncidentAnalysisResult {
  incidentSummary: string;
  timeline: TimelineEvent[];
  analysisThen: HistoricalAnalysis;
  analysisNow: HistoricalAnalysis;
  keyChanges: KeyChange[];
}

// Types for the new Business Section
export interface BusinessStructure {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  icon: React.FC<{className?: string}>;
}

export interface BusinessLaw {
  id: string;
  name: string;
  summary: string;
  keyAspects: string[];
}

export interface RegistrationPerk {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{className?: string}>;
}

// Types for the new Eligibility Checker
export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Women' | 'Minority' | 'Disabled';
export type EducationLevel = '10th' | '12th' | 'Undergraduate' | 'Postgraduate';
export type OccupationCategory = 'Farmer' | 'Student' | 'Small Business Owner' | 'Urban Poor' | 'Rural Labourer';


export interface GovScheme {
  id: string;
  name: string;
  description: string;
  ministry: string;
  benefits: string[];
  officialLink: string;
  icon: React.FC<{className?: string}>;
  eligibilityCriteria: {
    maxAnnualIncome?: number;
    categories?: SocialCategory[];
    states?: string[] | 'All';
    minAge?: number;
    maxAge?: number;
    occupations?: OccupationCategory[];
  }
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  amount: string;
  officialLink: string;
  icon: React.FC<{className?: string}>;
  eligibilityCriteria: {
    educationLevel: EducationLevel[];
    fieldOfStudy?: string[];
    minPercentage?: number;
    maxAnnualIncome?: number;
    categories?: SocialCategory[];
    states?: string[] | 'All';
  }
}

export interface EligibilityCriteria {
  annualIncome: string;
  category: SocialCategory | '';
  state: string;
  educationLevel: EducationLevel | '';
  fieldOfStudy: string;
  occupation: OccupationCategory | '';
}