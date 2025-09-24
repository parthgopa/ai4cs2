import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const ResearchAssistant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    topic: '',
    researchType: '',
    scope: '',
    outputStyle: '',
    preferredSources: ''
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const steps = [
    {
      id: 1,
      field: 'topic',
      title: 'Topic / Subject',
      question: 'What topic would you like to research?',
      placeholder: 'e.g., Loans to Directors, Insider Trading, Independent Directors',
      type: 'text'
    },
    {
      id: 2,
      field: 'researchType',
      title: 'Type of Research',
      question: 'What type of research do you need?',
      type: 'select',
      options: [
        { value: '', label: 'Select research type...' },
        { value: 'Legal', label: 'Legal' },
        { value: 'Compliance', label: 'Compliance' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Business', label: 'Business' },
        { value: 'General', label: 'General' }
      ]
    },
    {
      id: 3,
      field: 'scope',
      title: 'Scope / Depth',
      question: 'What level of detail do you need?',
      type: 'select',
      options: [
        { value: '', label: 'Select scope...' },
        { value: 'Short summary', label: 'Short summary' },
        { value: 'Detailed analysis', label: 'Detailed analysis' },
        { value: 'Case laws', label: 'Case laws' },
        { value: 'Global comparison', label: 'Global comparison' }
      ]
    },
    {
      id: 4,
      field: 'outputStyle',
      title: 'Output Style',
      question: 'How would you like the output formatted?',
      type: 'select',
      options: [
        { value: '', label: 'Select output style...' },
        { value: 'Bullet points', label: 'Bullet points' },
        { value: 'Structured report', label: 'Structured report' },
        { value: 'Table', label: 'Table' },
        { value: 'Infographic draft', label: 'Infographic draft' }
      ]
    },
    {
      id: 5,
      field: 'preferredSources',
      title: 'Preferred Sources (Optional)',
      question: 'Any specific sources you prefer? (Optional)',
      placeholder: 'e.g., Companies Act, SEBI, RBI, IBC, Journals, Websites',
      type: 'text',
      optional: true
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    if (!currentStepData.optional && !formData[currentStepData.field]) {
      alert('Please fill in this field before proceeding.');
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    generateResearch();
  };

  const handleEdit = (stepId) => {
    setCurrentStep(stepId);
    setShowConfirmation(false);
  };

  const generateResearch = async () => {
    setLoading(true);
    setResponse('');

    const prompt = `You are an AI Research Assistant specializing in Legal & Compliance Insights for Company Secretaries.

Research Request:
- Topic/Subject: ${formData.topic}
- Type of Research: ${formData.researchType}
- Scope/Depth: ${formData.scope}
- Output Style: ${formData.outputStyle}
- Preferred Sources: ${formData.preferredSources || 'Standard legal and compliance sources'}

Please provide a comprehensive research output structured with the following blocks:

## Overview / Introduction
Context of the topic and its relevance in corporate law and compliance.

## Statutory Provisions
Relevant Sections, Rules, Notifications, and Circulars from applicable laws including:
- Companies Act 2013 and Rules
- SEBI Regulations
- RBI Guidelines
- IBC provisions (if applicable)
- Other relevant statutes

## Judicial Precedents (Case Laws)
Provide at least 2-3 key cases from NCLT/NCLAT, High Court, Supreme Court if available.
For each case, show:
- Case Name
- Citation
- Court
- Year
- Ratio/Principle

**Most Recent Case:** Highlight the most recent relevant case separately.

## Comparisons / Trends ${formData.scope.includes('Global') ? '(Global Practices)' : '(Industry Practices)'}
${formData.scope.includes('Global') ? 'Compare with global practices and international standards.' : 'Analyze current industry trends and best practices.'}

## Practical Implications
- Compliance requirements
- Duties and responsibilities
- Penalties for non-compliance
- Available exemptions (if any)
- Best practices for implementation

## References / Sources
List all Acts, Rules, Notifications, Circulars, and Journals referenced.

Format the output as: ${formData.outputStyle}
Keep answers concise but authoritative. Focus on practical applicability for Company Secretaries.
Remove all introductory paragraph, end notes and any other non-relevant content.
`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the research output. Please try again.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the research output. Please try again later.");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      topic: '',
      researchType: '',
      scope: '',
      outputStyle: '',
      preferredSources: ''
    });
    setResponse('');
    setShowConfirmation(false);
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  if (loading) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="input-card">
              <div className="text-center">
                <FaSpinner className="spinner me-2" style={{ fontSize: '2rem' }} />
                <h3>Generating Research Output...</h3>
                <p>Please wait while we analyze and compile your research request.</p>
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
            <h1 className="card-title" style={{ marginBottom: '6px' }}>Research Results:</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>{formData.topic}</h2>
            <Card className="output-card">
              <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                <Button
                  variant="outline-secondary"
                  onClick={resetForm}
                >
                  <FaArrowLeft className="me-1" />
                  New Research
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
                        fileName: `${formData.topic}-research-report.pdf`,
                        title: `Research Report: ${formData.topic}`
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
                        fileName: `${formData.topic}-research-report.docx`,
                        title: `Research Report: ${formData.topic}`
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

  if (showConfirmation) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="input-card">
              <h2 className="card-title">Confirm Research Details</h2>
              <div className="mb-4">
                <p>Please review your research request:</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li className="mb-2">
                    <strong>Topic:</strong> {formData.topic}
                    <Button variant="link" size="sm" onClick={() => handleEdit(1)} className="ms-2">Edit</Button>
                  </li>
                  <li className="mb-2">
                    <strong>Research Type:</strong> {formData.researchType}
                    <Button variant="link" size="sm" onClick={() => handleEdit(2)} className="ms-2">Edit</Button>
                  </li>
                  <li className="mb-2">
                    <strong>Scope:</strong> {formData.scope}
                    <Button variant="link" size="sm" onClick={() => handleEdit(3)} className="ms-2">Edit</Button>
                  </li>
                  <li className="mb-2">
                    <strong>Output Style:</strong> {formData.outputStyle}
                    <Button variant="link" size="sm" onClick={() => handleEdit(4)} className="ms-2">Edit</Button>
                  </li>
                  {formData.preferredSources && (
                    <li className="mb-2">
                      <strong>Preferred Sources:</strong> {formData.preferredSources}
                      <Button variant="link" size="sm" onClick={() => handleEdit(5)} className="ms-2">Edit</Button>
                    </li>
                  )}
                </ul>
              </div>
              <p><strong>Do you confirm these details for research?</strong></p>
              <div className="d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={() => setShowConfirmation(false)}>
                  <FaArrowLeft className="me-1" />
                  Back to Edit
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                  <FaCheck className="me-1" />
                  Yes, Generate Research
                </Button>
              </div>
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="card-title mb-0">AI Research Assistant</h2>
              <span className="badge bg-primary">Step {currentStep} of {steps.length}</span>
            </div>
            
            <div className="progress mb-4">
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
                aria-valuenow={currentStep} 
                aria-valuemin="0" 
                aria-valuemax={steps.length}
              ></div>
            </div>

            <Form>
              <Form.Group className="form-group">
                <Form.Label className="form-label">
                  {currentStepData.question}
                  {currentStepData.optional && <span className="text-muted"> (Optional)</span>}
                </Form.Label>
                
                {currentStepData.type === 'text' ? (
                  <Form.Control
                    type="text"
                    name={currentStepData.field}
                    value={formData[currentStepData.field]}
                    onChange={handleInputChange}
                    placeholder={currentStepData.placeholder}
                    className="form-control"
                    autoFocus
                  />
                ) : (
                  <Form.Select
                    name={currentStepData.field}
                    value={formData[currentStepData.field]}
                    onChange={handleInputChange}
                    className="form-select"
                    autoFocus
                  >
                    {currentStepData.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button 
                  variant="outline-secondary" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <FaArrowLeft className="me-1" />
                  Previous
                </Button>
                
                <Button 
                  className="features-button"
                  onClick={handleNext}
                >
                  {currentStep === steps.length ? (
                    <>
                      <FaSearch className="me-1" />
                      Review & Confirm
                    </>
                  ) : (
                    <>
                      Next
                      <FaArrowRight className="ms-1" />
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResearchAssistant;
