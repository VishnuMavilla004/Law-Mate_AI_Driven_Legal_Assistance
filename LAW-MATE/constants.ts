import React from 'react';
import type { Category, LawUpdate, BasicRight, GovCertificate, EmergencyContact, BusinessStructure, RegistrationPerk, BusinessLaw, GovScheme, Scholarship, SocialCategory, EducationLevel, OccupationCategory } from './types';

export const THEME_COLORS = {
  // AI‑powered colour scheme
  primary: '#1E3A8A', // Dark Blue
  secondary: '#06B6D4', // Cyan
  accent: '#7C3AED', // Purple
  background: '#F3F4F6', // Light Gray
  text: '#1F2937', // Charcoal
};

export const CATEGORIES: Category[] = [
  'Workplace Issues',
  'Women Safety',
  'Cybercrime & Online Fraud',
  'Consumer Complaints',
  'Education / College',
  'Property / Family',
  'Business & Corporate',
  'General / Other'
];

export const MOCK_LAW_UPDATES: LawUpdate[] = [
  {
    id: '1',
    title: 'Digital Personal Data Protection Act, 2023',
    summary: 'Establishes a comprehensive framework for the protection of personal digital data.',
    effectiveDate: 'August 11, 2023',
    tags: ['Cyber', 'Data Privacy']
  },
  {
    id: '2',
    title: 'Bharatiya Nyaya Sanhita, 2023',
    summary: 'A new penal code that replaces the Indian Penal Code, 1860, with modern provisions.',
    effectiveDate: 'July 1, 2024',
    tags: ['Criminal Law', 'Major Reform']
  },
  {
    id: '3',
    title: 'Consumer Protection (E-commerce) Rules, 2020 Amendment',
    summary: 'Introduces stricter norms for e-commerce platforms to protect consumer interests.',
    effectiveDate: 'May 17, 2023',
    tags: ['Consumer', 'E-commerce']
  }
];

export const MOCK_BASIC_RIGHTS: BasicRight[] = [
  {
    id: '1',
    name: 'Right to Equality',
    descriptionSimple: 'Ensures equal treatment for all citizens, prohibiting discrimination on grounds of religion, race, caste, sex or place of birth.',
    category: 'Fundamental Right'
  },
  {
    id: '2',
    name: 'Right to Freedom',
    descriptionSimple: 'Includes freedom of speech, expression, assembly, association, movement, residence, and profession.',
    category: 'Fundamental Right'
  },
  {
    id: '3',
    name: 'Right against Exploitation',
    descriptionSimple: 'Prohibits all forms of forced labour, child labour and trafficking of human beings.',
    category: 'Fundamental Right'
  },
    {
    id: '4',
    name: 'Right to Life and Personal Liberty',
    descriptionSimple: 'Guarantees the right to live with human dignity and personal liberty.',
    category: 'Fundamental Right'
  }
];

export const MOCK_GOV_CERTIFICATES: GovCertificate[] = [
  {
    id: '1',
    name: 'Birth Certificate',
    description: 'An official record of a person\'s birth, required for school admissions, voter ID, etc.',
    keyDocuments: ['Hospital birth record', 'Parents\' ID proof', 'Address proof'],
    validationInfo: 'Valid for a lifetime.',
    officialLink: 'https://crsorgi.gov.in/web/index.php/auth/login',
    roadmap: [
        { stepNumber: 1, title: 'Get Hospital Record', description: 'Obtain the birth report from the hospital where the birth occurred. This is the primary proof.' },
        { stepNumber: 2, title: 'Visit Municipal Office', description: 'Go to the local Municipal Corporation office or the Registrar\'s office for births and deaths.' },
        { stepNumber: 3, title: 'Fill Application Form', description: 'Complete the birth registration form with all required details of the child and parents.' },
        { stepNumber: 4, title: 'Submit Documents', description: 'Submit the form along with copies of parents\' ID and address proof.' },
        { stepNumber: 5, title: 'Collect Certificate', description: 'The certificate is typically issued within 7-15 days. Collect it from the office after verification.' },
    ]
  },
  {
    id: '2',
    name: 'Passport',
    description: 'An essential travel document for international travel, serving as proof of identity and nationality.',
    keyDocuments: ['Proof of Date of Birth', 'ID proof with photo', 'Address proof', 'Proof of nationality'],
    validationInfo: 'Typically valid for 10 years for adults.',
    officialLink: 'https://www.passportindia.gov.in/',
    roadmap: [
        { stepNumber: 1, title: 'Register Online', description: 'Create an account on the official Passport Seva website and fill out the application form online.' },
        { stepNumber: 2, title: 'Pay & Schedule Appointment', description: 'Pay the required fee online and book an appointment slot at your nearest Passport Seva Kendra (PSK).' },
        { stepNumber: 3, title: 'Visit PSK', description: 'Visit the PSK on your appointment date with all original documents for verification.' },
        { stepNumber: 4, title: 'Police Verification', description: 'A police verification will be initiated for your address. This is a mandatory security check.' },
        { stepNumber: 5, title: 'Receive Passport', description: 'Once verification is complete, the passport is printed and dispatched to your address via Speed Post.' },
    ]
  },
  {
    id: '3',
    name: 'Driving License',
    description: 'Permits an individual to operate a motor vehicle on public roads.',
    keyDocuments: ['Age proof', 'Address proof', 'Learner\'s license', 'Application form'],
    validationInfo: 'Validity varies by state, typically 20 years or until age 50.',
    officialLink: 'https://parivahan.gov.in/parivahan/',
    roadmap: [
        { stepNumber: 1, title: 'Get Learner\'s License', description: 'Apply for a learner\'s license online via the Parivahan Sarathi website and pass the online test.' },
        { stepNumber: 2, title: 'Practice Driving', description: 'You must wait at least 30 days after getting your learner\'s license before applying for a permanent one.' },
        { stepNumber: 3, title: 'Book Driving Test', description: 'Book a slot for the permanent license driving test at your local RTO.' },
        { stepNumber: 4, title: 'Pass the Test', description: 'Pass the practical driving test conducted by an RTO inspector.' },
        { stepNumber: 5, title: 'Biometrics & Receive DL', description: 'Complete the biometric process at the RTO. The permanent driving license will be sent to your address.' },
    ]
  },
  {
    id: '4',
    name: 'Aadhaar Card',
    description: 'A 12-digit unique identity number issued by the UIDAI to all residents of India.',
    keyDocuments: ['Identity proof', 'Address proof', 'Date of Birth proof', 'Biometrics'],
    validationInfo: 'Valid for a lifetime, but updating details like address is recommended.',
    officialLink: 'https://uidai.gov.in/',
    roadmap: [
        { stepNumber: 1, title: 'Find Enrollment Center', description: 'Locate your nearest Aadhaar enrollment center via the official UIDAI website.' },
        { stepNumber: 2, title: 'Fill Enrollment Form', description: 'Complete the enrollment form with your personal details.' },
        { stepNumber: 3, title: 'Provide Documents & Biometrics', description: 'Submit your proof of identity and address, and provide your biometrics (fingerprints and iris scan).' },
        { stepNumber: 4, title: 'Get Enrollment Slip', description: 'You will receive an enrollment slip with an ID that can be used to track your Aadhaar status.' },
        { stepNumber: 5, title: 'Download e-Aadhaar', description: 'Once generated, you can download the e-Aadhaar from the UIDAI website. The physical card will be mailed.' },
    ]
  },
  {
    id: '5',
    name: 'Caste Certificate',
    description: 'Officially certifies that a person belongs to a particular caste or community (SC/ST/OBC).',
    keyDocuments: ['Identity proof (Aadhaar)', 'Address proof', 'Proof of caste from a relative', 'Affidavit'],
    validationInfo: 'Typically valid for a lifetime unless specified otherwise by the state government.',
    officialLink: 'https://services.india.gov.in/',
    roadmap: [
        { stepNumber: 1, title: 'Gather Documents', description: 'Collect all required documents, including ID, address, and proof of caste (e.g., a relative\'s certificate).' },
        { stepNumber: 2, title: 'Apply at Local Office', description: 'Apply at the Taluk, Tehsil, or District Collector\'s office. Many states also offer online portals.' },
        { stepNumber: 3, title: 'Fill Application & Affidavit', description: 'Complete the application form and get a self-declaration affidavit notarized.' },
        { stepNumber: 4, title: 'Submit & Verification', description: 'Submit the application. A local enquiry and verification process will be conducted by officials.' },
        { stepNumber: 5, title: 'Collect Certificate', description: 'After successful verification, the certificate is issued and can be collected from the office.' },
    ]
  },
  {
    id: '6',
    name: 'Income Certificate',
    description: 'Certifies the annual income of a person or family. Used for various government schemes.',
    keyDocuments: ['Identity proof', 'Address proof', 'Salary slips or income proof', 'Ration card'],
    validationInfo: 'Usually valid for one financial year. Needs to be renewed annually.',
    officialLink: 'https://services.india.gov.in/',
    roadmap: [
        { stepNumber: 1, title: 'Collect Income Proof', description: 'Gather all documents proving your annual income, such as salary slips, ITR, or employer letter.' },
        { stepNumber: 2, title: 'Apply Online or Offline', description: 'Apply through your state\'s e-District portal or at the local Tehsildar/Revenue office.' },
        { stepNumber: 3, title: 'Submit Application', description: 'Fill the form and attach all required documents, including an affidavit for income declaration.' },
        { stepNumber: 4, title: 'Verification by Revenue Officer', description: 'A local revenue officer or Village Administrative Officer (VAO) will verify the details provided.' },
        { stepNumber: 5, title: 'Issuance of Certificate', description: 'Once approved, the Income Certificate will be issued, digitally signed, and can be downloaded or collected.' },
    ]
  },
  {
    id: '7',
    name: 'EWS Certificate',
    description: 'For Economically Weaker Sections (EWS) to avail a 10% reservation in government jobs and education.',
    keyDocuments: ['Aadhaar Card', 'PAN Card', 'Income & Asset Certificate', 'Self-declaration'],
    validationInfo: 'Valid for one financial year. Must be renewed to continue availing benefits.',
    officialLink: 'https://services.india.gov.in/',
    roadmap: [
        { stepNumber: 1, title: 'Check Eligibility Criteria', description: 'Ensure your family\'s gross annual income is below ₹8 lakh and you meet the asset criteria.' },
        { stepNumber: 2, title: 'Get Income and Asset Form', description: 'Obtain the prescribed "Income and Asset Certificate" application form.' },
        { stepNumber: 3, title: 'Gather Supporting Documents', description: 'Collect all necessary documents, including income proof, asset documents, PAN, and Aadhaar.' },
        { stepNumber: 4, title: 'Submit to Issuing Authority', description: 'Submit the application to the designated authority in your area (e.g., District Magistrate/Tehsildar).' },
        { stepNumber: 5, 'title': 'Verification and Issuance', 'description': 'The authorities will verify your application and, upon approval, issue the EWS certificate.' },
    ]
  }
];


// Icons for Emergency Contacts
// FIX: The icon components were defined using JSX syntax in a .ts file, which caused parsing errors.
// Changed to use React.createElement to be compatible with a standard TypeScript file.
const PoliceIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', {
        className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    }))
);

const AmbulanceIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', {
        className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15"
    }))
);

const FireIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', {
        className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round", strokeLinejoin: "round", d: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797A8.33 8.33 0 0112 2.25c1.153 0 2.243.3 3.224.865.527.288.94.724 1.254 1.272zM12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
    }))
);

const WomenHelplineIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', {
        className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round", strokeLinejoin: "round", d: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.152a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    }))
);

const CyberCrimeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', {
        className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    }))
);

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: '1',
    serviceName: 'Police',
    number: '100',
    description: 'For immediate police assistance in any emergency situation.',
    icon: PoliceIcon,
  },
  {
    id: '2',
    serviceName: 'Ambulance',
    number: '102',
    description: 'For medical emergencies and to request an ambulance.',
    icon: AmbulanceIcon,
  },
  {
    id: '3',
    serviceName: 'Fire Department',
    number: '101',
    description: 'To report a fire or related emergencies.',
    icon: FireIcon,
  },
  {
    id: '4',
    serviceName: 'Women Helpline',
    number: '1091',
    description: 'A dedicated helpline for women in distress.',
    icon: WomenHelplineIcon,
  },
  {
    id: '5',
    serviceName: 'Cyber Crime Helpline',
    number: '1930',
    description: 'To report financial cyber fraud or online crimes.',
    icon: CyberCrimeIcon,
  },
];


// --- Business Section Constants ---

const BriefcaseIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.92a2.25 2.25 0 01-2.15-2.553L4.27 8.427a2.25 2.25 0 012.23-2.096h3.62a2.25 2.25 0 012.23 2.096l1.2 5.723a2.25 2.25 0 002.15 2.553H20.25zM16.5 8.25h-9v-1.5a1.5 1.5 0 011.5-1.5h6a1.5 1.5 0 011.5 1.5v1.5z" }))
);

const ShieldIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" }))
);

const BankIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" }))
);

const HandshakeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" }))
);

export const MOCK_BUSINESS_STRUCTURES: BusinessStructure[] = [
    { id: '1', name: 'Private Limited Company', description: 'A separate legal entity with limited liability for its members. Ideal for startups and growing businesses.', bestFor: 'Startups seeking funding, scalable businesses.', icon: BriefcaseIcon },
    { id: '2', name: 'Limited Liability Partnership (LLP)', description: 'A hybrid structure combining the benefits of a partnership and a company, with limited liability.', bestFor: 'Professional firms (lawyers, CAs), small to medium enterprises.', icon: BriefcaseIcon },
    { id: '3', name: 'One Person Company (OPC)', description: 'Allows a single entrepreneur to operate a corporate entity with limited liability protection.', bestFor: 'Solo entrepreneurs and consultants.', icon: BriefcaseIcon },
    { id: '4', name: 'Sole Proprietorship', description: 'The simplest structure where the business is owned and run by one individual. No separate legal entity.', bestFor: 'Small local businesses, freelancers.', icon: BriefcaseIcon },
];

export const MOCK_REGISTRATION_PERKS: RegistrationPerk[] = [
    { id: '1', title: 'Limited Liability', description: 'Protects your personal assets from business debts and lawsuits.', icon: ShieldIcon },
    { id: '2', title: 'Access to Funding', description: 'Registered entities are more attractive to investors and can raise capital.', icon: BankIcon },
    { id: '3', title: 'Builds Credibility', description: 'A registered business is perceived as more trustworthy by customers and partners.', icon: HandshakeIcon },
    { id: '4', title: 'Perpetual Succession', description: 'The business continues to exist even if the owners change, ensuring longevity.', icon: ShieldIcon }
];

export const MOCK_BUSINESS_LAWS: BusinessLaw[] = [
    { id: '1', name: 'The Companies Act, 2013', summary: 'Governs the incorporation, responsibilities, and dissolution of companies.', keyAspects: ['Director duties', 'Shareholder rights', 'Corporate governance norms'] },
    { id: '2', name: 'Goods and Services Tax (GST) Act, 2017', summary: 'A comprehensive indirect tax on the supply of goods and services.', keyAspects: ['GST registration thresholds', 'Input tax credit', 'Compliance & return filing'] },
    { id: '3', name: 'MSME Development Act, 2006', summary: 'Provides a framework for the promotion and development of Micro, Small, and Medium Enterprises.', keyAspects: ['Udyam Registration benefits', 'Delayed payment protection', 'Access to schemes'] }
];


// --- Eligibility Checker Constants ---

export const STATES_LIST: string[] = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];
export const SOCIAL_CATEGORIES_LIST: SocialCategory[] = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Women', 'Minority', 'Disabled'];
export const EDUCATION_LEVELS_LIST: EducationLevel[] = ['10th', '12th', 'Undergraduate', 'Postgraduate'];
export const OCCUPATION_CATEGORIES_LIST: OccupationCategory[] = ['Farmer', 'Student', 'Small Business Owner', 'Urban Poor', 'Rural Labourer'];


const BuildingLibraryIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" }))
);

const BookOpenIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" }))
);


export const MOCK_GOV_SCHEMES: GovScheme[] = [
    {
        id: 'gs1',
        name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
        description: 'Provides income support of ₹6,000 per year to all landholding farmer families.',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        benefits: ['Financial support of ₹6,000/year in three installments.'],
        officialLink: 'https://pmkisan.gov.in/',
        icon: BuildingLibraryIcon,
        eligibilityCriteria: {
            states: 'All',
            occupations: ['Farmer'],
        }
    },
    {
        id: 'gs2',
        name: 'Pradhan Mantri Awas Yojana - Urban (PMAY-U)',
        description: 'Aims to provide affordable housing to the urban poor.',
        ministry: 'Ministry of Housing and Urban Affairs',
        benefits: ['Subsidy on home loan interest rates.', 'Financial assistance for house construction.'],
        officialLink: 'https://pmay-urban.gov.in/',
        icon: BuildingLibraryIcon,
        eligibilityCriteria: {
            maxAnnualIncome: 1800000, // For MIG-II
            categories: ['EWS', 'Women', 'Minority', 'SC', 'ST', 'OBC'],
            states: 'All',
            occupations: ['Urban Poor'],
        }
    },
    {
        id: 'gs3',
        name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
        description: 'Provides a health insurance cover of up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.',
        ministry: 'Ministry of Health and Family Welfare',
        benefits: ['Cashless hospitalization.', 'Covers pre-hospitalization and post-hospitalization expenses.'],
        officialLink: 'https://pmjay.gov.in/',
        icon: BuildingLibraryIcon,
        eligibilityCriteria: {
            categories: ['SC', 'ST'], // Based on SECC 2011 data, often targets these groups
            states: 'All',
            occupations: ['Rural Labourer'],
        }
    },
     {
        id: 'gs4',
        name: 'Sukanya Samriddhi Yojana',
        description: 'A small savings scheme for the girl child, offering a high interest rate.',
        ministry: 'Ministry of Finance',
        benefits: ['High tax-free interest rate.', 'Financial security for girl child\'s education and marriage.'],
        officialLink: 'https://www.indiapost.gov.in/Financial/Pages/Content/sukanya-samriddhi-yojana.aspx',
        icon: BuildingLibraryIcon,
        eligibilityCriteria: {
            categories: ['Women'],
            maxAge: 10, // Girl child must be below 10 years
            states: 'All'
        }
    },
    {
        id: 'gs5',
        name: 'PM SVANidhi Scheme',
        description: 'A special micro-credit facility for street vendors, providing a collateral-free working capital loan.',
        ministry: 'Ministry of Housing and Urban Affairs',
        benefits: ['Initial working capital loan of up to ₹10,000.', 'Interest subsidy on timely repayment.'],
        officialLink: 'https://pmsvanidhi.mohua.gov.in/',
        icon: BuildingLibraryIcon,
        eligibilityCriteria: {
            states: 'All',
            occupations: ['Small Business Owner']
        }
    }
];

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
    {
        id: 'sc1',
        name: 'Post-Matric Scholarship for SC Students',
        provider: 'Ministry of Social Justice and Empowerment',
        description: 'Financial assistance to Scheduled Caste students pursuing post-matriculation courses.',
        amount: 'Varies, covers tuition fees and maintenance allowance.',
        officialLink: 'https://scholarships.gov.in/',
        icon: BookOpenIcon,
        eligibilityCriteria: {
            educationLevel: ['12th', 'Undergraduate', 'Postgraduate'],
            maxAnnualIncome: 250000,
            categories: ['SC'],
            states: 'All'
        }
    },
    {
        id: 'sc2',
        name: 'Central Sector Scheme of Scholarship for College and University Students',
        provider: 'Department of Higher Education',
        description: 'Merit-based scholarship for students who have scored above 80th percentile in their Class 12 board exams.',
        amount: '₹10,000 to ₹20,000 per annum.',
        officialLink: 'https://scholarships.gov.in/',
        icon: BookOpenIcon,
        eligibilityCriteria: {
            educationLevel: ['Undergraduate', 'Postgraduate'],
            minPercentage: 80,
            maxAnnualIncome: 450000,
            states: 'All'
        }
    },
    {
        id: 'sc3',
        name: 'Merit Cum Means Scholarship for Professional and Technical Courses',
        provider: 'Ministry of Minority Affairs',
        description: 'Financial support for meritorious students from minority communities pursuing technical or professional courses.',
        amount: 'Up to ₹20,000 per annum + course fees.',
        officialLink: 'https://scholarships.gov.in/',
        icon: BookOpenIcon,
        eligibilityCriteria: {
            educationLevel: ['Undergraduate', 'Postgraduate'],
            fieldOfStudy: ['Engineering', 'Medicine', 'Management', 'Law'],
            minPercentage: 50,
            maxAnnualIncome: 250000,
            categories: ['Minority'],
            states: 'All'
        }
    },
     {
        id: 'sc4',
        name: 'PRAGATI Scholarship Scheme for Girl Students',
        provider: 'AICTE',
        description: 'Aimed at providing assistance for the advancement of girls pursuing technical education.',
        amount: '₹50,000 per annum.',
        officialLink: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati-Saksham-Scholarship-Scheme',
        icon: BookOpenIcon,
        eligibilityCriteria: {
            educationLevel: ['Undergraduate'],
            fieldOfStudy: ['Engineering', 'Technology'],
            maxAnnualIncome: 800000,
            categories: ['Women'],
            states: 'All'
        }
    }
];