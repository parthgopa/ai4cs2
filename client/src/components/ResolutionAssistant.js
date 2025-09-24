import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button, Alert } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaGavel, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const ResolutionAssistant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complianceRequirement, setComplianceRequirement] = useState('');
  const [identifiedLaw, setIdentifiedLaw] = useState(null);
//   const [userConfirmed, setUserConfirmed] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState({
    background: '',
    reasons: '',
    financialImpact: '',
    effectiveDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Common compliance scenarios with their legal requirements
  const complianceScenarios = {
    'Appointment of Director': {
      section: 'Section 161',
      rule: 'Rule 8',
      resolutionType: 'Board Resolution',
      description: 'Appointment of Additional Director or Director to fill casual vacancy'
    },
    'Increase in Borrowing Powers': {
      section: 'Section 180(1)(c)',
      rule: 'Rule 13',
      resolutionType: 'Special Resolution',
      description: 'Increase in borrowing powers beyond paid-up capital and free reserves'
    },
    'Change of Registered Office': {
      section: 'Section 13',
      rule: 'Rule 30',
      resolutionType: 'Special Resolution',
      description: 'Change of registered office from one state to another'
    },
    'Related Party Transaction': {
      section: 'Section 188',
      rule: 'Rule 15',
      resolutionType: 'Ordinary Resolution',
      description: 'Approval of Related Party Transactions'
    },
    'Issue of Shares': {
      section: 'Section 62',
      rule: 'Rule 13',
      resolutionType: 'Special Resolution',
      description: 'Issue of shares on preferential basis'
    },
    'Alteration of Articles': {
      section: 'Section 14',
      rule: 'Rule 28',
      resolutionType: 'Special Resolution',
      description: 'Alteration of Articles of Association'
    },
    'Approval of Annual Accounts': {
      section: 'Section 129',
      rule: 'Rule 7',
      resolutionType: 'Ordinary Resolution',
      description: 'Adoption of Annual Financial Statements'
    },
    'Appointment of Auditor': {
      section: 'Section 139',
      rule: 'Rule 7',
      resolutionType: 'Ordinary Resolution',
      description: 'Appointment of Statutory Auditor'
    }
  };

  const handleComplianceInput = (e) => {
    setComplianceRequirement(e.target.value);
  };

  const identifyLaw = () => {
    if (!complianceRequirement.trim()) {
      alert('Please provide the compliance requirement or transaction details.');
      return;
    }

    // Check if the input matches any predefined scenario
    const matchedScenario = Object.keys(complianceScenarios).find(scenario => 
      complianceRequirement.toLowerCase().includes(scenario.toLowerCase()) ||
      scenario.toLowerCase().includes(complianceRequirement.toLowerCase())
    );

    if (matchedScenario) {
      setIdentifiedLaw({
        scenario: matchedScenario,
        ...complianceScenarios[matchedScenario]
      });
    } else {
      // For custom scenarios, provide a general framework
      setIdentifiedLaw({
        scenario: complianceRequirement,
        section: 'To be determined based on specific requirements',
        rule: 'To be determined based on specific requirements',
        resolutionType: 'To be determined',
        description: 'Custom compliance requirement - legal provisions will be identified during drafting'
      });
    }
    setCurrentStep(2);
  };

  const handleUserConfirmation = (confirmed) => {
    // setUserConfirmed(confirmed);
    if (confirmed) {
      if (identifiedLaw.resolutionType === 'Special Resolution') {
        setCurrentStep(3); // Go to additional details for Special Resolution
      } else {
        setCurrentStep(4); // Skip to drafting for Board/Ordinary Resolution
      }
    } else {
      setCurrentStep(1); // Go back to input
      setIdentifiedLaw(null);
    }
  };

  const handleAdditionalDetailsChange = (e) => {
    const { name, value } = e.target;
    setAdditionalDetails({
      ...additionalDetails,
      [name]: value
    });
  };

  const proceedToDrafting = () => {
    setCurrentStep(4);
  };

  const draftResolution = async () => {
    setLoading(true);
    setResponse('');

    let prompt = '';

    if (identifiedLaw.resolutionType === 'Board Resolution') {
      prompt = `You are Resolution Assistant under the Companies Act, 2013.

Draft a Board Resolution for the following requirement:
- Compliance Requirement: ${complianceRequirement}
- Applicable Section: ${identifiedLaw.section}
- Applicable Rule: ${identifiedLaw.rule}

Please provide a clean, professional Board Resolution draft following the standard format:
1. Board Resolution heading
2. Date and venue
3. Present directors
4. Resolution text with proper legal language
5. Signature blocks

Ensure the resolution is compliant with Companies Act, 2013 and includes all necessary legal formalities.`;

    } else if (identifiedLaw.resolutionType === 'Ordinary Resolution') {
      prompt = `You are Resolution Assistant under the Companies Act, 2013.

Draft an Ordinary Resolution for the following requirement:
- Compliance Requirement: ${complianceRequirement}
- Applicable Section: ${identifiedLaw.section}
- Applicable Rule: ${identifiedLaw.rule}

Please provide a clean, professional Ordinary Resolution draft following the standard format:
1. Resolution heading
2. "RESOLVED THAT" clause with proper legal language
3. Authority delegation (if applicable)
4. Effective date
5. Any conditions or limitations

Ensure the resolution is compliant with Companies Act, 2013.`;

    } else if (identifiedLaw.resolutionType === 'Special Resolution') {
      prompt = `You are Resolution Assistant under the Companies Act, 2013.

Draft a Special Resolution with Explanatory Statement for the following requirement:
- Compliance Requirement: ${complianceRequirement}
- Applicable Section: ${identifiedLaw.section}
- Applicable Rule: ${identifiedLaw.rule}

Additional Details:
- Background: ${additionalDetails.background}
- Reasons: ${additionalDetails.reasons}
- Financial Impact: ${additionalDetails.financialImpact}
- Effective Date: ${additionalDetails.effectiveDate}

Please provide:

## SPECIAL RESOLUTION
A clean, professional Special Resolution draft with:
1. Resolution heading
2. "RESOLVED THAT" clause with detailed terms
3. Authority delegation
4. Conditions and limitations
5. Effective date

## EXPLANATORY STATEMENT (Under Section 102)
A comprehensive explanatory statement including:
1. Background and rationale
2. Financial implications
3. Benefits to the company
4. Risk factors (if any)
5. Recommendation of the Board
6. Material facts and considerations
7. Interest of directors/promoters (if applicable)

Ensure both documents are compliant with Companies Act, 2013 and SEBI regulations (if applicable).

Remove all introductory paragraph, end notes and any other non-relevant content.`;
    }

    prompt += `\n\nEnd with disclaimer: "Please review carefully and adapt to your company's specific facts before use."`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the resolution. Please try again.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the resolution. Please try again later.");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setComplianceRequirement('');
    setIdentifiedLaw(null);
    // setUserConfirmed(false);
    setAdditionalDetails({
      background: '',
      reasons: '',
      financialImpact: '',
      effectiveDate: ''
    });
    setResponse('');
  };

  if (loading) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="input-card">
              <div className="text-center">
                <FaSpinner className="spinner me-2" style={{ fontSize: '2rem' }} />
                <h3>Drafting Resolution...</h3>
                <p>Please wait while we prepare your resolution document.</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (response) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <h1 className="card-title" style={{ marginBottom: '6px' }}>Draft Resolution:</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>{complianceRequirement}</h2>
            <Card className="output-card">
              <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                <Button
                  variant="outline-secondary"
                  onClick={resetForm}
                >
                  <FaArrowLeft className="me-1" />
                  New Resolution
                </Button>
                <div className="d-flex">
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => {
                      navigator.clipboard.writeText(response);
                      alert('Copied to clipboard!');
                    }}
                  >
                    <FaCopy className="me-1" />
                    <span className="d-none d-sm-inline">Copy</span>
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      const { generatePDF } = PDFGenerator({
                        content: response,
                        fileName: `${complianceRequirement}-resolution.pdf`,
                        title: `Resolution: ${complianceRequirement}`
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
                    onClick={() => {
                      const { generateWord } = WordGenerator({
                        content: response,
                        fileName: `${complianceRequirement}-resolution.docx`,
                        title: `Resolution: ${complianceRequirement}`
                      });
                      generateWord();
                    }}
                  >
                    <FaFileWord className="me-1" />
                    <span className="d-none d-sm-inline">Word</span>
                  </Button>
                </div>
              </div>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Resolution Assistant</h2>
            <p className="text-muted mb-4">Draft compliant resolutions under the Companies Act, 2013</p>

            {currentStep === 1 && (
              <>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Please provide the compliance requirement or transaction details
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={complianceRequirement}
                    onChange={handleComplianceInput}
                    placeholder="e.g., Appointment of Director, Increase in Borrowing Powers, Change of Registered Office, Related Party Transaction, Issue of Shares"
                    className="form-control"
                    autoFocus
                  />
                </Form.Group>
                <Button 
                  className="features-button"
                  onClick={identifyLaw}
                  disabled={!complianceRequirement.trim()}
                >
                  <FaGavel className="me-1" />
                  Identify Legal Requirements
                </Button>
              </>
            )}

            {currentStep === 2 && identifiedLaw && (
              <>
                <Alert variant="info">
                  <h5>Legal Requirements Identified</h5>
                  <p><strong>Compliance Requirement:</strong> {identifiedLaw.scenario}</p>
                  <p><strong>Applicable Section:</strong> {identifiedLaw.section}</p>
                  <p><strong>Applicable Rule:</strong> {identifiedLaw.rule}</p>
                  <p><strong>Required Resolution Type:</strong> <span className="badge bg-primary">{identifiedLaw.resolutionType}</span></p>
                  <p><strong>Description:</strong> {identifiedLaw.description}</p>
                </Alert>
                
                <p className="mb-3">
                  <strong>As per Companies Act, 2013 — {identifiedLaw.section} & {identifiedLaw.rule}, 
                  this requires a {identifiedLaw.resolutionType}. Do you want me to draft it?</strong>
                </p>
                
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => handleUserConfirmation(false)}
                  >
                    <FaArrowLeft className="me-1" />
                    No, Go Back
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => handleUserConfirmation(true)}
                  >
                    <FaCheck className="me-1" />
                    Yes, Draft Resolution
                  </Button>
                </div>
              </>
            )}

            {currentStep === 3 && identifiedLaw?.resolutionType === 'Special Resolution' && (
              <>
                <Alert variant="warning">
                  <strong>Additional Details Required for Special Resolution</strong>
                  <p>Special Resolutions require an Explanatory Statement under Section 102. Please provide additional details:</p>
                </Alert>
                
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Background</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="background"
                    value={additionalDetails.background}
                    onChange={handleAdditionalDetailsChange}
                    placeholder="Brief background of the proposal"
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label className="form-label">Reasons</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="reasons"
                    value={additionalDetails.reasons}
                    onChange={handleAdditionalDetailsChange}
                    placeholder="Reasons for the proposal"
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label className="form-label">Financial Impact</Form.Label>
                  <Form.Control
                    type="text"
                    name="financialImpact"
                    value={additionalDetails.financialImpact}
                    onChange={handleAdditionalDetailsChange}
                    placeholder="Financial implications, if any"
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label className="form-label">Effective Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="effectiveDate"
                    value={additionalDetails.effectiveDate}
                    onChange={handleAdditionalDetailsChange}
                    className="form-control"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setCurrentStep(2)}
                  >
                    <FaArrowLeft className="me-1" />
                    Back
                  </Button>
                  <Button 
                    className="features-button"
                    onClick={proceedToDrafting}
                  >
                    Proceed to Draft
                    <FaArrowRight className="ms-1" />
                  </Button>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <Alert variant="success">
                  <h5>Ready to Draft Resolution</h5>
                  <p><strong>Type:</strong> {identifiedLaw.resolutionType}</p>
                  <p><strong>For:</strong> {complianceRequirement}</p>
                  {identifiedLaw.resolutionType === 'Special Resolution' && (
                    <p><em>Will include both Resolution and Explanatory Statement</em></p>
                  )}
                </Alert>
                
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setCurrentStep(identifiedLaw.resolutionType === 'Special Resolution' ? 3 : 2)}
                  >
                    <FaArrowLeft className="me-1" />
                    Back
                  </Button>
                  <Button 
                    className="features-button"
                    onClick={draftResolution}
                  >
                    <FaGavel className="me-1" />
                    Draft Resolution
                  </Button>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResolutionAssistant;
