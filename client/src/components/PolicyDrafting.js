import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FaClipboardList, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

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
                <p className="lead" style={{ color: 'var(--muted-color)' }}>
                  Select a policy type below to start drafting professional and legally compliant policies.
                </p>
              </div>

              <Row>
                {policyOptions.map((policy) => (
                  <Col md={6} lg={4} key={policy.id} className="mb-4">
                    <Card 
                      className={`h-100 policy-card ${policy.status === 'available' ? '' : ''}`}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        backgroundColor: 'var(--card-bg)',
                        borderColor: policy.status === 'available' ? 'var(--primary-color)' : 'var(--border-color)',
                        color: 'var(--text-color)'
                      }}
                      onClick={() => handlePolicyClick(policy)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
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
                            style={{ 
                              color: policy.status === 'available' ? 'var(--primary-color)' : 'var(--muted-color)' 
                            }} 
                          />
                        </div>
                        <h6 className="card-title mb-3">{policy.title}</h6>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <small style={{ color: 'var(--muted-color)' }}>
                            Click to start drafting
                          </small>
                          <FaChevronRight style={{ color: 'var(--primary-color)' }} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'var(--accent-color)' }}>
                <Row>
                  <Col md={8}>
                    <h6 className="mb-2" style={{ color: 'var(--text-color)' }}>📋 Policy Drafting Features</h6>
                    <ul className="list-unstyled mb-0" style={{ color: 'var(--text-color)' }}>
                      <li className="mb-1">• <strong style={{ color: 'var(--primary-color)' }}>AI-Powered:</strong> <span style={{ color: 'var(--text-color)' }}>Generate legally compliant policies using advanced AI</span></li>
                      <li className="mb-1">• <strong style={{ color: 'var(--primary-color)' }}>Customizable:</strong> <span style={{ color: 'var(--text-color)' }}>Input company-specific details for personalized policies</span></li>
                      <li className="mb-1">• <strong style={{ color: 'var(--primary-color)' }}>Export Options:</strong> <span style={{ color: 'var(--text-color)' }}>Download as PDF or Word document</span></li>
                      <li className="mb-1">• <strong style={{ color: 'var(--primary-color)' }}>Compliance Ready:</strong> <span style={{ color: 'var(--text-color)' }}>Ensures adherence to latest regulations</span></li>
                    </ul>
                  </Col>
                  <Col md={4} className="text-center">
                    <FaClipboardList size={60} style={{ color: 'var(--primary-color)', opacity: 0.5 }} />
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
