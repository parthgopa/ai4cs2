import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';
import './styles/Profile.css';

// Custom Components
import { ThemeProvider } from './Common/ThemeContext';
import { PreferencesProvider } from './store/preferences';
import Header from './Common/Header';
import Footer from './Common/Footer';
import HomePage from './components/HomePage';
import ScrollToTop from './Common/ScrollToTop';
import About from './components/About';
import Contact from './components/Contact';
import Tools from './components/Tools';
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
import ReplyToNoticeRD from './components/ReplyToNoticeRD';
import ReplyToNoticeNCLT from './components/ReplyToNoticeNCLT';
import ReplyToNoticeROC from './components/ReplyToNoticeROC';
import PetitionPreparator from './components/PetetionPrepator';
import BoardMeetingAssistant from './components/BoardMeetingAssistant';
import GeneralMeetingAssistant from './components/GeneralMeetingAssistant';
import Forms from './components/Forms';
import CapitalRaisingAdvisoryAgreement from './components/CapitalRaisingAdvisoryAgreement';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import { OTPVerification } from './components/OTPVerification';
import Profile from './components/Profile';
import ProfileSettings from './components/ProfileSettings';
import ProfilePreferences from './components/ProfilePreferences';
import UserHistory from './components/UserHistory';

// Layout wrapper component to conditionally show header/footer
function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify-otp';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/resolutions" element={<ResolutionsDraftingPage />} />
            <Route path="/compliance-calendar" element={<ComplianceCalendar />} />
            <Route path="/procedure-practice" element={<ProceduresPractice />} />
            <Route path="/policy-drafting" element={<PolicyDrafting />} />
            <Route path="/policy-drafting/meeting-and-minutes-policy" element={<MeetingMinutesPolicy />} />
            <Route path="/policy-drafting/statutory-registers-policy" element={<StatutoryRegisterMaintenancePolicy />} />
            <Route path="/policy-drafting/related-party-transaction-policy" element={<RelatedPartyTransactionPolicy />} />
            <Route path="/policy-drafting/insider-trading-policy" element={<InsiderTradingPolicy />} />
            <Route path="/policy-drafting/document-management-policy" element={<DocumentManagementPolicy />} />
            <Route path="/policy-drafting/csr-policy" element={<CSRPolicy />} />
            <Route path="/scenario-solver" element={<ScenarioSolver />} />
            <Route path="/agreement-drafting" element={<AgreementDrafting />} />
            <Route path="/secretarial-audit-toolkit" element={<SecretarialAudit />} />
            <Route path="/reply-to-notice-rd" element={<ReplyToNoticeRD />} />
            <Route path="/reply-to-notice-nclt" element={<ReplyToNoticeNCLT />} />
            <Route path="/reply-to-notice-roc" element={<ReplyToNoticeROC />} />
            <Route path='/petetion-preparator' element={<PetitionPreparator />} />
            <Route path="/legal-research" element={<LegalResearch />} />
            <Route path="/legal-opinion" element={<LegalOpinion />} />
            <Route path="/regulatory-updation" element={<RegulatoryUpdation />} />
            <Route path="/statutory-registers" element={<StatutoryRegisters />} />
            <Route path="/board-meeting-assistant" element={<BoardMeetingAssistant />} />
            <Route path="/general-meeting-assistant" element={<GeneralMeetingAssistant />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/capital-raising-advisory-agreement" element={<CapitalRaisingAdvisoryAgreement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/profile/preferences" element={<ProfilePreferences />} />
            <Route path="/profile/history" element={<UserHistory />} />
          </Routes>
        </Layout>
      </Router>
      </PreferencesProvider>
    </ThemeProvider>
  );
}

export default App;
