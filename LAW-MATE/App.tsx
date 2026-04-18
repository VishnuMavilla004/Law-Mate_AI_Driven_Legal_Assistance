import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ChatExperience } from './components/ChatExperience';
import { Footer } from './components/Footer';
import { NewLawsSection } from './components/NewLawsSection';
import { BasicRightsSection } from './components/BasicRightsSection';
import { GovCertificatesSection } from './components/GovCertificatesSection';
import { EmergencyContactsSection } from './components/EmergencyContactsSection';
import { PastIncidentAnalyzer } from './components/PastIncidentAnalyzer';
import { BusinessSection } from './components/BusinessSection';
import { EligibilityCheckerSection } from './components/EligibilityCheckerSection';
import { MLInsightsDashboard } from './components/MLInsightsDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text font-sans">
        <Navbar />
        <main className="w-full px-4 py-8">
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <ChatExperience />
                <PastIncidentAnalyzer />
                <BusinessSection />
                <EligibilityCheckerSection />
                <NewLawsSection />
                <BasicRightsSection />
                <GovCertificatesSection />
                <EmergencyContactsSection />
              </>
            } />
            <Route path="/ml-insights" element={<MLInsightsDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
