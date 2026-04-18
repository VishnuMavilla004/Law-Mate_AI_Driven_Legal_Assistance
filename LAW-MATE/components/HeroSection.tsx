import React from 'react';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';

export const HeroSection: React.FC = () => {
  const scrollToChat = () => {
    document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
  };
    
  return (
    <section id="hero-section" className="text-center py-24 md:py-32 bg-gradient-to-br from-primary-light/20 via-secondary-light/20 to-accent-light/20">
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
                <Logo className="h-16 w-16 text-primary-dark" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-dark mb-6 tracking-tight font-heading text-glow">
                Understand Your Legal Rights,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Simplified with AI.</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary mb-10">
                LawMate is your intelligent legal companion. Describe your situation in plain language to get instant analysis on laws, your rights, and actionable next steps.
            </p>
            <div className="flex justify-center items-center mb-12">
                <Button variant="primary" className="px-10 py-4 text-lg" onClick={scrollToChat}>
                Start Your Free Analysis
                </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-primary-dark mb-2">AI-Powered Chat</h3>
                    <p className="text-text-secondary">Get instant legal guidance through natural conversation</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-primary-dark mb-2">Comprehensive Analysis</h3>
                    <p className="text-text-secondary">Detailed breakdown of your rights and legal options</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-primary-dark mb-2">Privacy First</h3>
                    <p className="text-text-secondary">Your conversations are secure and confidential</p>
                </div>
            </div>
        </div>
    </section>
  );
};