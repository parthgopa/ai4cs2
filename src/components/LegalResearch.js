import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const LegalResearch = () => {
  const [formData, setFormData] = useState({
    userQuery: '',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    const prompt = `You are a senior legal research analyst and AI assistant specializing in Indian corporate, regulatory, and compliance law.
Interpret the following user's query and respond by referring to any or all of the following legal frameworks, depending on the context:

Indian Companies Act, 2013 (with all amendments)

SEBI Guidelines and Regulations (including LODR, ICDR, Takeover Code, etc.)

MCA Circulars, Notifications, and Clarifications

Judgements from NCLT and NCLAT

RBI Circulars and Master Directions (if applicable)

Relevant sections of the Income Tax Act, 1961 (especially corporate taxation and TDS/TCS)

IBC – Insolvency and Bankruptcy Code, 2016

Any applicable Rules, Schedules, or Secretarial Standards

Your response must include the following components:

1. Relevant Sections/Rules/Clauses (from applicable law)

2. Clear Explanation in simple legal English

3. Compliance Checklist (if process-related): forms, timelines, filings, responsible authority

4. Case Law Summary (from NCLT/NCLAT/SC/HC, if available)

5. Regulatory Circulars/Clarifications (MCA, SEBI, RBI) with date

6. Penalties and Consequences (if any non-compliance)

7. Keep tone formal, structured, and legally precise. Use bullet points or numbered steps.

8. If multiple laws apply, show how they intersect or override (e.g., SEBI vs Companies Act).

9. Mention the last updated year or circular version where applicable.

If no direct provision exists, mention "No explicit provision found" and suggest related guidance.

User query - "${formData.userQuery}"`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            console.log(data.candidates[0].content.parts[0].text);
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse('Sorry, we couldn\'t generate a response. Please try again.');
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse('An error occurred while processing your request. Please try again.');
    }
  };

  const RedStrong = ({ children }) => {
    // Apply Tailwind CSS class 'text-red-500' to make the text red
    return <strong style={{textDecoration: 'underline'}}>{children}</strong>;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    alert('Response copied to clipboard!');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Container fluid className="legal-research-container">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="main-card shadow-sm">
            <Card.Header className="text-center">
              <h2 className="mb-0">
                <FaSearch className="me-2" />
                Legal Research
              </h2>
              <p className="text-muted mb-0">
                Comprehensive legal research and analysis for Indian corporate law
              </p>
            </Card.Header>
            
            <Card.Body>
              <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Legal Research Query</strong>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="userQuery"
                        value={formData.userQuery}
                        onChange={handleInputChange}
                        placeholder="Enter your legal research query here... (e.g., What are the requirements for related party transactions under Companies Act 2013?)"
                        required
                      />
                      <Form.Text className="text-muted">
                        Ask about Indian corporate law, SEBI regulations, MCA circulars, compliance requirements, case laws, etc.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center">
                  <button
                    variant="primary"
                    type="submit"
                    disabled={loading || !formData.userQuery.trim()}
                    className="features-button"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="spinner me-2" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <FaSearch className="me-2" />
                        Conduct Legal Research
                      </>
                    )}
                  </button>
                </div>
              </Form>

              {response && (
                <Card className="response-card mt-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Legal Research Analysis</h5>
                    <div className="action-buttons">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={copyToClipboard}
                        className="me-2"
                      >
                        <FaCopy className="me-1" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline-danger"
                        size="sm" 
                        onClick={() => {
                          const { generatePDF } = PDFGenerator({ 
                            content: response, 
                            fileName: `legal-research-analysis-${new Date().toISOString().split('T')[0]}.pdf`,
                            title: "Legal Research Analysis"
                          });
                          generatePDF();
                        }}
                        className="me-2"
                      >
                        <FaFilePdf className="me-1" />
                        <span className="d-none d-sm-inline">PDF</span>
                      </Button>
                      <Button 
                        variant="outline-success"
                        size="sm" 
                        onClick={() => {
                          const { generateWord } = WordGenerator({ 
                            content: response, 
                            fileName: `legal-research-analysis-${new Date().toISOString().split('T')[0]}.docx`,
                            title: "Legal Research Analysis"
                          });
                          generateWord();
                        }}
                      >
                        <FaFileWord className="me-1" />
                        <span className="d-none d-sm-inline">Word</span>
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="markdown-content">
                      <ReactMarkdown
                      components={{
                        // Override the default 'strong' component with our custom 'RedStrong' component
                        strong: RedStrong,
                      }}
                      >{response}</ReactMarkdown>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>

          <AIDisclaimer />
        </Col>
      </Row>
    </Container>
  );
};

export default LegalResearch;
