import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';

// FIX: The original file was missing the Navbar component export.
export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const isHomePage = location.pathname === '/';

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-primary/90 backdrop-blur-lg border-b border-border' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center cursor-pointer">
                        <Logo className="h-8 w-8 text-primary animate-pulse" />
                        <span className="ml-2 text-2xl font-bold text-primary font-heading">LawMate</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {isHomePage ? (
                            <>
                                <a onClick={() => scrollTo('chat-section')} className="text-text-secondary font-medium hover:text-primary-dark transition-colors cursor-pointer">Live Chat</a>
                                <a onClick={() => scrollTo('past-incident-analyzer-section')} className="text-text-secondary font-medium hover:text-primary-dark transition-colors cursor-pointer">Case Analysis</a>
                                <a onClick={() => scrollTo('business-section')} className="text-text-secondary font-medium hover:text-primary-dark transition-colors cursor-pointer">For Business</a>
                                <a onClick={() => scrollTo('eligibility-checker-section')} className="text-text-secondary font-medium hover:text-primary-dark transition-colors cursor-pointer">Schemes</a>
                                <a onClick={() => scrollTo('new-laws-section')} className="text-text-secondary font-medium hover:text-primary-dark transition-colors cursor-pointer">New Laws</a>
                                <a onClick={() => scrollTo('basic-rights-section')} className="text-text-secondary font-medium hover:text-primary-dark transition-colors cursor-pointer">Your Rights</a>
                            </>
                        ) : null}
                        <Link to="/ml-insights" className="text-text-secondary font-medium hover:text-primary-dark transition-colors">ML Insights</Link>
                    </div>

                    <div>
                        <Button variant="primary" onClick={() => isHomePage ? scrollTo('chat-section') : null} className="py-2.5 px-6">
                            {isHomePage ? 'Get Started Free' : 'Back to Home'}
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
};