import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import '../styles/ResolutionsDraftingPage.css';

const ResolutionsDraftingPage = () => {
  // const navigate = useNavigate();
  
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({});
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Handle click on a specific resolution item
  const handleResolutionClick = (sectionId, itemId) => {
    console.log(`Resolution clicked: ${sectionId} - ${itemId}`);
    // In the future, this will navigate to specific resolution pages
    // navigate(`/resolutions/${sectionId}/${itemId}`);
  };

  return (
    <main className="resolutions-page">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <h1 className="page-title">Resolutions Drafting</h1>
          </Col>
        </Row>
        
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="content-card">
              <Card.Body>
                <h2 className="section-title">Resolutions - Index</h2>
                
                {/* 1.1 Incorporation & Commencement */}
                <div className="resolution-section">
                  <div 
                    className="resolution-section-header"
                    onClick={() => handleResolutionClick('incorporation', 'main')}
                  >
                    <h3 className="resolution-section-title">1.1. Incorporation & Commencement</h3>
                    <div className="resolution-section-info">
                      <p><strong>Subject Heading:</strong> Name Approval & Company Incorporation</p>
                      <p><strong>Applicable Sections & Rules:</strong> Section 4, 7, 10, Companies (Incorporation) Rules, 2014.</p>
                    </div>
                    <div className="resolution-arrow">→</div>
                  </div>
                </div>
                
                {/* 1.2.a Equity Capital Raising */}
                <div className="resolution-section">
                  <div 
                    className="resolution-section-header"
                    onClick={() => toggleSection('equity')}
                  >
                    <h3 className="resolution-section-title">1.2.a. Equity Capital Raising</h3>
                    <div className={`resolution-toggle ${expandedSections['equity'] ? 'open' : ''}`}>
                      {expandedSections['equity'] ? '−' : '+'}
                    </div>
                  </div>
                  
                  {expandedSections['equity'] && (
                    <div className="resolution-subsection">
                      <ListGroup variant="flush" className="resolution-list">
                        <ListGroup.Item 
                          action 
                          onClick={() => handleResolutionClick('equity', 'initial-issue')}
                          className="resolution-item"
                        >
                          <div className="resolution-content">
                            <h4 className="resolution-item-title">1. Initial Issue of Shares / Allotment</h4>
                            <p className="resolution-item-description">Section: 42 (Private Placement), 62(1)(a) (Rights), 23 (Public or Private Issue)</p>
                          </div>
                          <div className="resolution-arrow">→</div>
                        </ListGroup.Item>
                        
                        <ListGroup.Item 
                          action 
                          onClick={() => handleResolutionClick('equity', 'rights-issue')}
                          className="resolution-item"
                        >
                          <div className="resolution-content">
                            <h4 className="resolution-item-title">2. Rights Issue</h4>
                            <p className="resolution-item-description">Section: 62(1)(a)</p>
                          </div>
                          <div className="resolution-arrow">→</div>
                        </ListGroup.Item>
                        
                        <ListGroup.Item 
                          action 
                          onClick={() => handleResolutionClick('equity', 'bonus-issue')}
                          className="resolution-item"
                        >
                          <div className="resolution-content">
                            <h4 className="resolution-item-title">3. Bonus Issue</h4>
                            <p className="resolution-item-description">Section: 63</p>
                          </div>
                          <div className="resolution-arrow">→</div>
                        </ListGroup.Item>
                        
                        <ListGroup.Item 
                          action 
                          onClick={() => handleResolutionClick('equity', 'private-placement')}
                          className="resolution-item"
                        >
                          <div className="resolution-content">
                            <h4 className="resolution-item-title">4. Private Placement of Equity Shares</h4>
                            <p className="resolution-item-description">Section: 42</p>
                          </div>
                          <div className="resolution-arrow">→</div>
                        </ListGroup.Item>
                        
                        <ListGroup.Item 
                          action 
                          onClick={() => handleResolutionClick('equity', 'preferential-allotment')}
                          className="resolution-item"
                        >
                          <div className="resolution-content">
                            <h4 className="resolution-item-title">5. Preferential Allotment</h4>
                            <p className="resolution-item-description">Section: 62(1)(c) and 42</p>
                          </div>
                          <div className="resolution-arrow">→</div>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  )}
                </div>
                
                {/* 1.2.b Debt Capital Raising */}
                <div className="resolution-section">
                  <div 
                    className="resolution-section-header"
                    onClick={() => toggleSection('debt')}
                  >
                    <h3 className="resolution-section-title">1.2.b. Debt Capital Raising</h3>
                    <div className={`resolution-toggle ${expandedSections['debt'] ? 'open' : ''}`}>
                      {expandedSections['debt'] ? '−' : '+'}
                    </div>
                  </div>
                  
                  {expandedSections['debt'] && (
                    <div className="resolution-subsection">
                      <ListGroup variant="flush" className="resolution-list">
                        <ListGroup.Item 
                          action 
                          onClick={() => handleResolutionClick('debt', 'secured-debentures')}
                          className="resolution-item"
                        >
                          <div className="resolution-content">
                            <h4 className="resolution-item-title">1. Issue of Secured Debentures</h4>
                            <p className="resolution-item-description">Section: 71 and Rule 18 of Companies (Share Capital & Debentures) Rules, 2014</p>
                          </div>
                          <div className="resolution-arrow">→</div>
                        </ListGroup.Item>
                        
                        <ListGroup.Item 
                          action 
                          onClick={() => handleResolutionClick('debt', 'convertible-debentures')}
                          className="resolution-item"
                        >
                          <div className="resolution-content">
                            <h4 className="resolution-item-title">2. Issue of Convertible Debentures</h4>
                            <p className="resolution-item-description">Section: 71(1) and 62(3)</p>
                          </div>
                          <div className="resolution-arrow">→</div>
                        </ListGroup.Item>
                        
                        <ListGroup.Item 
                          action 
                          onClick={() => handleResolutionClick('debt', 'charge-creation')}
                          className="resolution-item"
                        >
                          <div className="resolution-content">
                            <h4 className="resolution-item-title">3. Creation of Charge for Debenture</h4>
                            <p className="resolution-item-description">Section: 77</p>
                          </div>
                          <div className="resolution-arrow">→</div>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ResolutionsDraftingPage;
