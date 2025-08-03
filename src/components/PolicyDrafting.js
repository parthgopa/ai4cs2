import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaClipboardList, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PolicyDrafting = () => {
  const navigate = useNavigate();

  // Policy options with routes
  const policyOptions = [
    { id: 'meeting', title: 'Meeting and Minutes policy', route: '/policy-drafting/meeting-and-minutes-policy', status: 'available' },
    { id: 'statutory-registers-policy', title: 'Statutory Registers Policy', route: '/policy-drafting/statutory-registers-policy', status: 'available' },
    { id: 'related-party-transaction-policy', title: 'Related Party Transactions Policy', route: '/policy-drafting/related-party-transaction-policy', status: 'available' },
    { id: 'insider-trading-policy', title: 'Insider Trading Policy', route: '/policy-drafting/insider-trading-policy', status: 'available' },
    { id: 'document-management-policy', title: 'Document Management Policy', route: '/policy-drafting/document-management-policy', status: 'available' },
    { id: 'csr-policy', title: 'CSR Policy', route: '/policy-drafting/csr-policy', status: 'available' },
  ];

  const handlePolicyClick = (policy) => {
    if (policy.status === 'available') {
      navigate(policy.route);
    } else {
      alert(`${policy.title} is coming soon!`);
    }
  };



  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Policy Drafting</h2>
              <div className="text-center mb-4">
                <p className="lead text-muted">
                  Select a policy type below to start drafting professional and legally compliant policies.
                </p>
              </div>

              <Row>
                {policyOptions.map((policy) => (
                  <Col md={6} lg={4} key={policy.id} className="mb-4">
                    <Card 
                      className={`h-100 policy-card ${policy.status === 'available' ? 'border-primary' : 'border-secondary'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      onClick={() => handlePolicyClick(policy)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <FaClipboardList 
                            size={24} 
                            className={policy.status === 'available' ? 'text-primary' : 'text-muted'} 
                          />
                        </div>
                        <h6 className="card-title mb-3">{policy.title}</h6>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Click to start drafting
                          </small>
                          <FaChevronRight className="text-primary" />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="mt-4 p-3 bg-light rounded">
                <Row>
                  <Col md={8}>
                    <h6 className="mb-2">📋 Policy Drafting Features</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-1">• <strong>AI-Powered:</strong> Generate legally compliant policies using advanced AI</li>
                      <li className="mb-1">• <strong>Customizable:</strong> Input company-specific details for personalized policies</li>
                      <li className="mb-1">• <strong>Export Options:</strong> Download as PDF or Word document</li>
                      <li className="mb-1">• <strong>Compliance Ready:</strong> Ensures adherence to latest regulations</li>
                    </ul>
                  </Col>
                  <Col md={4} className="text-center">
                    <FaClipboardList size={60} className="text-muted opacity-50" />
                  </Col>
                </Row>
              </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PolicyDrafting;
