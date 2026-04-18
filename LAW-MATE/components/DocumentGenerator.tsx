import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { generateDocument } from '../services/geminiService';
import type { AnalysisResult, DocumentType, UserDetails } from '../types';
import { BackButton } from './ui/BackButton';

// This makes TypeScript aware of the jsPDF global variable from the script tag
declare const jspdf: any;

interface DocumentGeneratorProps {
  docType: DocumentType;
  analysis: AnalysisResult;
  onBack: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const FormInput: React.FC<{label: string, name: keyof UserDetails, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string}> = 
({ label, name, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-semibold text-text mb-2">{label}</label>
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-light"
            required
        />
    </div>
);


export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ docType, analysis, onBack }) => {
  const [step, setStep] = useState(1);
  const [userDetails, setUserDetails] = useState<UserDetails>({
      fullName: '', address: '', contact: '', opponentName: '', opponentAddress: ''
  });
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const validateStep1 = () => {
    return userDetails.fullName.trim() !== '' && userDetails.opponentName.trim() !== '';
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedDoc('');
    setStep(3); // Move to loading step
    try {
      const result = await generateDocument(docType, analysis, userDetails, additionalDetails);
      setGeneratedDoc(result);
      setStep(4); // Move to preview step
    } catch (error) {
      console.error("Failed to generate document:", error);
      alert("There was an error generating your document. Please try again.");
      setStep(2); // Go back to details step on error
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDoc);
    alert('Document copied to clipboard!');
  };
  
  const downloadAsPDF = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const textWidth = pageWidth - margin * 2;
    const lineHeight = 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(generatedDoc, textWidth);
    let y = margin;
    
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    
    doc.save(`${docType.replace(/\s/g, '_')}_Draft.pdf`);
  };

  return (
    <section className="py-16">
        <Card className="max-w-4xl mx-auto">
            <div className="p-8 border-b border-border">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-primary-dark font-heading">Document Generator</h2>
                        <p className="text-text-secondary">Drafting: <span className="font-semibold text-accent-dark">{docType}</span></p>
                    </div>
                     <BackButton onClick={onBack}>Back to Chat</BackButton>
                </div>
            </div>

            <div className="p-8">
                {/* Step 1: User Details */}
                {step === 1 && (
                    <div>
                        <h3 className="text-xl font-bold font-heading text-text mb-2">Step 1: Provide Your Details</h3>
                        <p className="text-sm text-text-secondary mb-6">This information is required to generate an accurate document.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Your Full Name" name="fullName" value={userDetails.fullName} onChange={handleDetailsChange} placeholder="e.g., Jane Doe" />
                            <FormInput label="Your Contact (Email/Phone)" name="contact" value={userDetails.contact} onChange={handleDetailsChange} placeholder="e.g., jane.doe@email.com" />
                            <div className="md:col-span-2">
                                <FormInput label="Your Full Address" name="address" value={userDetails.address} onChange={handleDetailsChange} placeholder="e.g., 123 Justice Lane, New Delhi" />
                            </div>
                            <FormInput label="Opposing Party's Full Name" name="opponentName" value={userDetails.opponentName} onChange={handleDetailsChange} placeholder="e.g., John Smith" />
                             <div className="md:col-span-2">
                                <FormInput label="Opposing Party's Address (if known)" name="opponentAddress" value={userDetails.opponentAddress} onChange={handleDetailsChange} placeholder="e.g., 456 Corporate Towers, Mumbai" />
                            </div>
                        </div>
                        <div className="mt-8 text-right">
                           <Button variant="primary" onClick={() => setStep(2)} disabled={!validateStep1()}>Next: Add Case Details &rarr;</Button>
                        </div>
                    </div>
                )}
                
                {/* Step 2: Additional Details */}
                {step === 2 && (
                    <div>
                        <h3 className="text-xl font-bold font-heading text-text mb-4">Step 2: Add Specific Points</h3>
                         <div className="bg-slate-50 p-4 rounded-lg border border-border mb-6">
                            <h4 className="font-semibold text-primary-dark">Case Summary from AI</h4>
                            <p className="text-sm text-text-secondary mt-1">{analysis.summary}</p>
                        </div>
                        <label htmlFor="additionalDetails" className="block text-sm font-semibold text-text mb-2">
                            Add any other details or instructions for the AI (optional)
                        </label>
                        <textarea
                            id="additionalDetails"
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value)}
                            rows={5}
                            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-light"
                            placeholder="e.g., Mention specific dates, names of witnesses, or desired outcomes..."
                        />
                        <div className="mt-8 flex justify-between items-center">
                            <BackButton onClick={() => setStep(1)}>Back to Your Details</BackButton>
                            <Button variant="primary" onClick={handleGenerate}>Generate {docType} Draft</Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Loading */}
                {step === 3 && (
                     <div>
                        <LoadingSpinner />
                        <p className="text-center text-text-secondary mt-4">LawMate is drafting your document, this may take a moment...</p>
                    </div>
                )}

                {/* Step 4: Preview & Export */}
                {step === 4 && (
                    <div>
                        <h3 className="text-xl font-bold font-heading text-text mb-4">Step 3: Preview and Export Your Draft</h3>
                        <div className="bg-slate-50 p-6 rounded-lg border border-border h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                            {generatedDoc}
                        </div>
                        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                            <Button variant="secondary" onClick={downloadAsPDF}>Download as PDF</Button>
                            <Button variant="subtle" onClick={copyToClipboard}>Copy to Clipboard</Button>
                            <Button variant="ghost" onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? 'Regenerating...' : 'Regenerate Draft'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    </section>
  );
};