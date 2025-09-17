import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Tools.css';
// Import icons
import { FaCalendarAlt, FaBalanceScale, FaGavel, FaChartLine, FaClipboardList, FaBook, FaFileAlt, FaBuilding, FaCheckCircle, FaCog } from 'react-icons/fa';
import { MdUpdate, MdAssessment, MdOutlineAppRegistration } from 'react-icons/md';
// Import ComingSoonModal component
import ComingSoonModal from './ComingSoonModal';
import { usePreferences } from '../store/preferences';
import { useAuth } from '../store/auth';

const Tools = () => {
  const navigate = useNavigate();
  const { preferences, isAutoFillEnabled } = usePreferences();
  const { isLoggedIn } = useAuth();
  
  // State for ComingSoonModal
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Function to open modal with feature title
  const openComingSoonModal = (featureTitle) => {
    setSelectedFeature(featureTitle);
    setShowModal(true);
  };
  
  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };
  
  // List of functionalities with icons and categories
  const functionalities = [
    {
      id: 'compliance-calendar',
      title: 'Compliance Calendar',
      category: 'Compliance',
      icon: <FaCalendarAlt />,
    },
    {
      id: 'secretarial-audit-toolkit',
      title: 'Secretarial Audit Toolkit',
      category: 'Audit',
      icon: <FaBalanceScale />,
    },
    {
      id: 'regulatory-updation',
      title: 'Regulatory Compass',
      category: 'Compliance',
      icon: <MdUpdate />,
    },
    {
      id: 'statutory-registers',
      title: 'Statutory Register and Records',
      category: 'Records',
      icon: <FaBook />,
    },
    {
      id: 'legal-opinion',
      title: 'Legal Opinion',
      category: 'Legal',
      icon: <FaGavel />,
    },
    {
      id: 'legal-research',
      title: 'Legal Research',
      category: 'Legal',
      icon: <FaBalanceScale />,
    },
    {
      id: 'procedure-practice',
      title: 'Procedure and Practice',
      category: 'Compliance',
      icon: <FaClipboardList />,
    },
    {
      id: 'forms',
      title: 'Forms',
      category: 'Compliance',
      icon: <FaFileAlt />,
    },
    {
      id: 'policy-drafting',
      title: 'Policy Drafting',
      category: 'Policy',
      icon: <FaClipboardList />,
    },
    {
      id: 'scenario-solver',
      title: 'Scenario Solver',
      category: 'Legal',
      icon: <FaChartLine />,
    },
    {
      id: 'agreement-drafting',
      title: 'Agreement Drafting',
      category: 'Agreement',
      icon: <MdAssessment />,
    },
    {
      id: 'capital-raising-advisory-agreement',
      title: 'Capital Raising Advisory Agreement',
      category: 'Agreement',
      icon: <MdAssessment />,
    },
    {
      id: 'reply-to-notice-rd',
      title: 'Reply to Notice - RD',
      category: 'Notices',
      icon: <MdOutlineAppRegistration />,
    },
    {
      id: 'reply-to-notice-nclt',
      title: 'Reply to Notice - NCLT',
      category: 'Notices',
      icon: <MdOutlineAppRegistration />,
    },
    {
      id: 'reply-to-notice-roc',
      title: 'Reply to Notice - ROC',
      category: 'Notices',
      icon: <MdOutlineAppRegistration />,
    },
    {
      id: 'petetion-preparator',
      title: 'Petition Preparator',
      category: 'Petition',
      icon: <MdOutlineAppRegistration />,
    },
    {
      id: 'board-meeting-assistant',
      title: 'Board Meeting Assistant',
      category: 'Meetings',
      icon: <FaClipboardList />,
    },
    {
      id: 'general-meeting-assistant',
      title: 'General Meeting Assistant',
      category: 'Meetings',
      icon: <FaCalendarAlt />,
    },
  ];
  
  // Implemented/active feature IDs
  const enabledIds = new Set([
    'compliance-calendar',
    'secretarial-audit-toolkit',
    'regulatory-updation',
    'statutory-registers',
    'legal-opinion',
    'legal-research',
    'procedure-practice',
    'forms',
    'policy-drafting',
    'scenario-solver',
    'agreement-drafting',
    'capital-raising-advisory-agreement',
    'reply-to-notice-rd',
    'reply-to-notice-nclt',
    'reply-to-notice-roc',
    'petetion-preparator',
    'board-meeting-assistant',
    'general-meeting-assistant',
  ]);

  // Get unique categories for filtering
  const categories = [...new Set(functionalities.map(item => item.category))].sort();

  // State for category filter
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFunctionalities = functionalities.filter((f) => {
    const q = searchQuery.trim().toLowerCase();
    const categoryMatch = selectedCategory === 'All' || f.category === selectedCategory;
    
    if (!q) return categoryMatch;
    return (
      categoryMatch && 
      (f.title.toLowerCase().includes(q) || 
      (f.category && f.category.toLowerCase().includes(q)))
    );
  });
  
  const handleFunctionalityClick = (id, title) => {
    // Navigate to specific pages for implemented features, show modal for others
    if (id === 'compliance-calendar') {
      navigate('/compliance-calendar');
    } else if (id === 'secretarial-audit-toolkit') {
      navigate('/secretarial-audit-toolkit');
    } else if (id === 'corporate-governance') {
      navigate('/corporate-governance');
    } else if (id === 'regulatory-updation') {
      navigate('/regulatory-updation');
    } else if (id === 'statutory-registers') {
      navigate('/statutory-registers');
    } else if (id === 'legal-opinion') {
      navigate('/legal-opinion');
    } else if (id === 'legal-research') {
      navigate('/legal-research');
    } else if (id === 'procedure-practice') {
      navigate('/procedure-practice');
    } else if (id === 'policy-drafting') {
      navigate('/policy-drafting');
    } else if (id === 'scenario-solver') {
      navigate('/scenario-solver');
    } else if (id === 'agreement-drafting') {
      navigate('/agreement-drafting');
    } else if (id === 'reply-to-notice-rd') {
      navigate('/reply-to-notice-rd');
    } else if (id === 'reply-to-notice-nclt') {
      navigate('/reply-to-notice-nclt');
    } else if (id === 'reply-to-notice-roc') {
      navigate('/reply-to-notice-roc');
    } else if (id === 'petetion-preparator') {
      navigate('/petetion-preparator');
    } else if (id === 'board-meeting-assistant') {
      navigate('/board-meeting-assistant');
    } else if (id === 'general-meeting-assistant') {
      navigate('/general-meeting-assistant');
    } else if (id === 'forms') {
      navigate('/forms');
    } else if (id === 'capital-raising-advisory-agreement') {
      navigate('/capital-raising-advisory-agreement');
    } else {
      openComingSoonModal(title);
    }
  };

  return (
    <main className="tools-page">
      <Container>
        {/* Header Section */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="tools-header">
              <h1 className="tools-title">AI Tools for Company Secretaries</h1>
              <p className="tools-description">
                AI tools for company secretaries: smarter, faster, compliant.
              </p>
            </div>
          </Col>
        </Row>

        {/* User Preferences Info */}
        {isLoggedIn && (
          <Row className="justify-content-center mb-4">
            <Col lg={10}>
              {preferences.defaultCompanyName && isAutoFillEnabled ? (
                <Alert variant="success" className="d-flex align-items-center">
                  <FaCheckCircle className="me-2" />
                  <div className="flex-grow-1">
                    <strong>Auto-fill enabled</strong> for <FaBuilding className="mx-1" /> 
                    <strong>{preferences.defaultCompanyName}</strong>
                    {preferences.defaultCIN && (
                      <span className="text-muted ms-2">({preferences.defaultCIN})</span>
                    )}
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-primary ms-2"
                    onClick={() => navigate('/profile/preferences')}
                  >
                    <FaCog className="me-1" /> Settings
                  </button>
                </Alert>
              ) : isLoggedIn ? (
                <Alert variant="info" className="d-flex align-items-center">
                  <FaBuilding className="me-2" />
                  <div className="flex-grow-1">
                    Set up your company preferences to auto-fill forms across all tools
                  </div>
                  <button 
                    className="btn btn-sm btn-primary ms-2"
                    onClick={() => navigate('/profile/preferences')}
                  >
                    <FaCog className="me-1" /> Setup Preferences
                  </button>
                </Alert>
              ) : null}
            </Col>
          </Row>
        )}

        {/* Search and Filter Section */}
        <Row className="justify-content-center mb-4">
          <Col lg={10}>
            <div className="tools-filters">
              <Row className="g-2 align-items-center">
                <Col xs={12} md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    aria-label="Search tools"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <div className="category-filters">
                    <button 
                      className={`category-filter ${selectedCategory === 'All' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('All')}
                    >
                      All
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Tools Grid */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="tools-grid">
              {filteredFunctionalities.length > 0 ? (
                filteredFunctionalities.map((item) => {
                  const isEnabled = enabledIds.has(item.id);
                  const cardClass = `tool-card ${isEnabled ? '' : 'disabled-tool'}`;
                  return (
                    <div key={item.id} className="tool-card-wrapper">
                      <Card 
                        className={cardClass}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleFunctionalityClick(item.id, item.title)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleFunctionalityClick(item.id, item.title); }}
                        aria-disabled={!isEnabled}
                      >
                        <Card.Body>
                          <div className="tool-icon">{item.icon}</div>
                          <div className="tool-content">
                            <div className="tool-title">{item.title}</div>
                            <div className="tool-category">{item.category}</div>
                          </div>
                          <div className="tool-arrow">→</div>
                        </Card.Body>
                      </Card>
                    </div>
                  );
                })
              ) : (
                <div className="no-results">
                  <p>No tools match your search criteria.</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* Coming Soon Modal */}
      <ComingSoonModal 
        show={showModal} 
        handleClose={closeModal} 
        featureTitle={selectedFeature} 
      />
    </main>
  );
};

export default Tools;
