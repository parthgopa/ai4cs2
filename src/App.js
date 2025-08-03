import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';

// Custom Components
import { ThemeProvider } from './Common/ThemeContext';
import Header from './Common/Header';
import Footer from './Common/Footer';
import HomePage from './components/HomePage';
import ResolutionsDraftingPage from './components/ResolutionsDraftingPage';
import ComplianceCalendar from './components/ComplianceCalendar';
import RegulatoryUpdation from './components/RegulatoryUpdation';
import StatutoryRegisters from './components/StatutoryRegisters';
import SecretarialAudit from './components/SecretarialAudit';
import LegalOpinion from './components/LegalOpinion';
import LegalResearch from './components/LegalResearch';
import ProceduresPractice from './components/ProceduresPractice';
import PolicyDrafting from './components/PolicyDrafting';
import CSRPolicy from './components/CSRPolicy';
import MeetingMinutesPolicy from './components/MeetingMinutesPolicy';
import StatutoryRegisterMaintenancePolicy from './components/StatutoryRegisterMaintenancePolicy';
import RelatedPartyTransactionPolicy from './components/RelatedPartyTransactionPolicy';
import InsiderTradingPolicy from './components/InsiderTradingPolicy';
import DocumentManagementPolicy from './components/DocumentManagementPolicy';
import ScenarioSolver from './components/ScenarioSolver';
import AgreementDrafting from './components/AgreementDrafting';
function App() {
  
  return (
    <ThemeProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/resolutions" element={<ResolutionsDraftingPage />} />
              <Route path="/compliance-calendar" element={<ComplianceCalendar />} />
              <Route path="/secretarial-audit" element={<SecretarialAudit />} />
              <Route path="/procedure-practice" element={<ProceduresPractice />} />
              {/* Added routes for all functionalities */}
              <Route path="/policy-drafting" element={<PolicyDrafting />} />
              <Route path="/policy-drafting/meeting-and-minutes-policy" element={<MeetingMinutesPolicy />} />
              <Route path="/policy-drafting/statutory-registers-policy" element={<StatutoryRegisterMaintenancePolicy />} />
              <Route path="/policy-drafting/related-party-transaction-policy" element={<RelatedPartyTransactionPolicy />} />
              <Route path="/policy-drafting/insider-trading-policy" element={<InsiderTradingPolicy />} />
              <Route path="/policy-drafting/document-management-policy" element={<DocumentManagementPolicy />} />
              <Route path="/policy-drafting/csr-policy" element={<CSRPolicy />} />
              <Route path="/scenario-solver" element={<ScenarioSolver />} />
              <Route path="/agreement-drafting" element={<AgreementDrafting />} />
              <Route path="/legal-research" element={<LegalResearch />} />
              <Route path="/legal-opinion" element={<LegalOpinion />} />
              <Route path="/strategic-advice" element={<div className="container mt-5"><h1>Strategic Advice</h1><p>This page is under development.</p></div>} />
              <Route path="/regulatory-updation" element={<RegulatoryUpdation />} />
              <Route path="/statutory-registers" element={<StatutoryRegisters />} />
              <Route path="/risk-assessment" element={<div className="container mt-5"><h1>Risk Assessment</h1><p>This page is under development.</p></div>} />
              <Route path="/board-meeting-management" element={<div className="container mt-5"><h1>Board Meeting Management</h1><p>This page is under development.</p></div>} />
              <Route path="/application-petition-appeal" element={<div className="container mt-5"><h1>Application, Petition and Appeal</h1><p>This page is under development.</p></div>} />
              <Route path="/shareholder-communication" element={<div className="container mt-5"><h1>Shareholder Communication</h1><p>This page is under development.</p></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
