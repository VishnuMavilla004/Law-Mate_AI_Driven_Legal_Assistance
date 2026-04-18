import React, { useState, useEffect } from 'react';
import type { Category, ChatMessage, AnalysisResult, DocumentType } from '../types';
import { CategorySelector } from './CategorySelector';
import { ChatPanel } from './ChatPanel';
import { InfoPanel } from './InfoPanel';
import { DocumentGenerator } from './DocumentGenerator';
import { analyzeLegal } from '../services/api';
import { BackButton } from './ui/BackButton';

export const ChatExperience: React.FC = () => {
  const [view, setView] = useState<'chat' | 'doc_generator'>('chat');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [docToGenerate, setDocToGenerate] = useState<{ type: DocumentType, analysis: AnalysisResult } | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      // If we are in the doc generator view and the URL changes back, switch to chat view.
      if (view === 'doc_generator' && window.location.hash !== '#doc-generator') {
        setView('chat');
        setDocToGenerate(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // On initial load, if the hash exists but we don't have the necessary state (e.g., from a refresh),
    // remove the hash to prevent a broken state.
    if (window.location.hash === '#doc-generator') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [view]);

  const handleSendMessage = async (message: string, imageDataUrl: string | null = null) => {
    if (!selectedCategory) {
      alert("Please select a category first.");
      return;
    }
    
    const newUserMessage: ChatMessage = { 
      sender: 'user', 
      text: message,
      ...(imageDataUrl && { media: { type: 'image', dataUrl: imageDataUrl } })
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // send query plus selected category to backend which in turn calls Gemini
      const result = await analyzeLegal(message, selectedCategory || '');
      const aiMessage: ChatMessage = { sender: 'ai', text: result.summary, analysis: result };
      setMessages(prev => [...prev, aiMessage]);
      setAnalysisResult(result);
    } catch (error: any) {
      console.error("Error analyzing situation:", error);
      // axios will set error.message to 'Network Error' when it cannot reach the
      // backend; provide a more helpful message in that case.
      let errorMessageText = "I'm sorry, I encountered an error. Please try again.";
      if (error && error.message === 'Network Error') {
        errorMessageText =
          "Network error: could not contact the server. " +
          "Make sure the backend is running and VITE_API_URL (or default http://localhost:5000) is set correctly.";
      } else if (error instanceof Error) {
        errorMessageText = error.message;
      }
      const errorMessage: ChatMessage = { sender: 'ai', text: errorMessageText };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
      handleSendMessage(suggestion);
  };

  const handleGenerateDocument = (docType: DocumentType) => {
    if (analysisResult) {
      setDocToGenerate({ type: docType, analysis: analysisResult });
      setView('doc_generator');
      window.history.pushState({ view: 'doc_generator' }, '', '#doc-generator');
    }
  };

  const handleBackToChat = () => {
    window.history.back();
  }

  const handleChangeCategory = () => {
    setSelectedCategory(null);
    setMessages([]);
    setAnalysisResult(null);
    setIsLoading(false);
  };

  if (view === 'doc_generator' && docToGenerate) {
    return <DocumentGenerator docType={docToGenerate.type} analysis={docToGenerate.analysis} onBack={handleBackToChat} />
  }

  return (
    <section id="chat-section" className="py-16 bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl shadow-black/10 border border-white/20">
      <div className="container mx-auto px-4">
        {!selectedCategory ? (
          <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4 font-heading">Start Your AI Legal Consultation</h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                First, please select a category that best describes your situation.
              </p>
              <CategorySelector selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-10">
                <div className="text-left">
                    <h2 className="text-3xl font-bold text-primary-dark font-heading">Legal Assistant</h2>
                    <p className="text-md text-text-secondary">
                        Category: <span className="font-semibold text-primary-dark">{selectedCategory}</span>
                    </p>
                </div>
                <BackButton onClick={handleChangeCategory}>Change Category</BackButton>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  analysisResult={analysisResult}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>
              <div>
                <InfoPanel result={analysisResult} isLoading={isLoading} onGenerateDocument={handleGenerateDocument} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};