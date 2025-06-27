import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';

// Custom Components
import { ThemeProvider } from './ThemeContext';
import Header from './Header';
import Footer from './Footer';
import HomePage from './components/HomePage';
import ResolutionsDraftingPage from './components/ResolutionsDraftingPage';
import ComplianceCalendar from './components/ComplianceCalendar';

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
              
              {/* Added routes for all functionalities */}
              <Route path="/legal-research" element={<div className="container mt-5"><h1>Legal Research</h1><p>This page is under development.</p></div>} />
              <Route path="/legal-opinion" element={<div className="container mt-5"><h1>Legal Opinion</h1><p>This page is under development.</p></div>} />
              <Route path="/strategic-advice" element={<div className="container mt-5"><h1>Strategic Advice</h1><p>This page is under development.</p></div>} />
              <Route path="/procedure-practice" element={<div className="container mt-5"><h1>Procedure and Practice</h1><p>This page is under development.</p></div>} />
              <Route path="/corporate-governance" element={<div className="container mt-5"><h1>Corporate Governance</h1><p>This page is under development.</p></div>} />
              <Route path="/regulatory-updation" element={<div className="container mt-5"><h1>Regulatory Updation</h1><p>This page is under development.</p></div>} />
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
